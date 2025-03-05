import AppDataSource from "../database/db";
import { User } from "../entities/user.entity";
import { DeepPartial } from "typeorm";
import { hashPassword } from "../validator/unitvalidate";
import { getPaginationInfo, paginate } from "../utils/pagination";
export class UserService {
  private userRepositry = AppDataSource.getRepository(User);
  async storeOtp(userId: number, otp: string) {
    await this.userRepositry.update(userId, {
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const existUser = await this.userRepositry.findOne({
      where: { id: Number(userId) },
    });
    if (
      !existUser ||
      existUser.otp !== otp ||
      new Date() > new Date(Number(existUser.otpExpires))
    ) {
      return false;
    }

    await this.userRepositry.update(userId, { otp: null, otpExpires: null });
    return true;
  }
  async getCategories(page: number = 1, limit: number = 10): Promise<User[]> {
        return paginate(this.userRepositry, page, limit);
      }
    
    
      async getPaginationInfo(page: number = 1, limit: number = 10) {
        return getPaginationInfo(this.userRepositry, page, limit);
      }
  async getone(data: { id: number }): Promise<User | null> {
    const user = await this.userRepositry.findOne({ where: { id: data.id } });
    if (!user) {
      throw new Error(`the user not found`);
    }
    return user;
  }
  async updateUser(data: DeepPartial<User>): Promise<User | null> {
    const existUser = await this.userRepositry.findOne({
      where: { id: data.id },
    });
    if (!existUser) {
      throw new Error(`the user not found`);
    }
    const updateuser = await this.updateFields(existUser, data);
    await this.userRepositry.save(updateuser);
    return updateuser;
  }
  private async updateFields(
    user: User,
    data: DeepPartial<User>
  ): Promise<User> {
    if (data.email) user.email = data.email;
    if (data.name) user.name = data.name;
    if (data.password) user.password = await hashPassword(data.password);
    if (data.role) user.role = data.role;

    return user;
  }
  async deleteUser(id: number): Promise<User | null> {
    const existUser = await this.userRepositry.findOne({ where: { id } });
    if (!existUser) {
      throw new Error("the user not found");
    }
    await this.userRepositry.delete({ id });
    return existUser;
  }
}
