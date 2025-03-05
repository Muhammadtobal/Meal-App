import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { inject, injectable } from "inversify";
import { AuthService } from "../services/auth.service";
import { TYPES } from "../config/types.config";
import dotenv from "dotenv";

dotenv.config();

@injectable()
export class PassportConfig {
  private authService: AuthService;

  constructor(@inject(TYPES.AuthService) authService: AuthService) {
    this.authService = authService;

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: "http://localhost:5000/api/auth/google/callback"

        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await this.authService.findOrCreateGoogleUser(profile);
            return done(null, user);
          } catch (error) {
            return done(error, undefined);
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await this.authService.findUserById(Number(id));
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }
}
