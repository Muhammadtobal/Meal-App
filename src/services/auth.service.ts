import "reflect-metadata";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../validator/unitvalidate";
import { User } from "../entities/user.entity";
import { DeepPartial } from "typeorm";
import { inject, injectable } from "inversify";
import AppDataSource from "../database/db";
import { generateOtp, sendOtp } from "../helpers/otpsend";
import { UserService } from "./user.service";
import { TYPES } from "../config/types.config";

@injectable()
export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  constructor(@inject(TYPES.UserService) private userService: UserService) {
    this.userService = userService;
  }

  async generateToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_TOKEN as string,
      { expiresIn: "3h" }
    );
  }

  async signup(data: DeepPartial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error("Email already exists");

    data.password = await hashPassword(data.password);
    return await this.userRepository.save(data);
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email: data.email } });
    if (!user) throw new Error("Email not found");
    
    if (user.password) {
      const isValid = await comparePassword(user.password, data.password);
      if (!isValid) throw new Error("Invalid password");
    }

    const otp = generateOtp();
    await this.userService.storeOtp(user.id, otp);
    if (user.email) await sendOtp(user.email, otp);

    return { message: "OTP sent to your email", userId: user.id };
  }

  async verifyOtp(userId: string, otp: string) {
    if (!userId || isNaN(Number(userId))) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findOne({ where: { id: parseInt(userId, 10) } });
    if (!user) throw new Error("User not found");

    const isValid = await this.userService.verifyOtp(userId, otp);
    if (!isValid) throw new Error("Invalid OTP");

    return await this.generateToken(user);
  }

  async findOrCreateGoogleUser(profile: any) {
    let user = await this.userRepository.findOne({ where: { googleId: profile.id } });

    if (!user) {
      user = await this.userRepository.save({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
      });
    }

    return user;
  }

  async findUserById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
