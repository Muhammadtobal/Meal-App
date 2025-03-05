import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { injectable, inject } from "inversify";
import { TYPES } from "../config/types.config";
import passport from "passport";

@injectable()
export class AuthController {
  private authService: AuthService;

  constructor(@inject(TYPES.AuthService) authService: AuthService) {
    this.authService = authService;
  }

  async singUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.signup(req.body);
      res.status(201).json({ message: "success SignUp", Data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authService.login(req.body);
      res.json({ success: true, response });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, otp } = req.body;
      const token = await this.authService.verifyOtp(id, otp);

      res
        .status(200)
        .cookie("Authorization", "Bearer " + token, {
          expires: new Date(Date.now() + 8 * 3600000),
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        })
        .json({ message: "Login success", Token: token });
    } catch (error) {
      next(error);
    }
  }

  googleAuth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }

  googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      async (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");

        try {
          const token = await this.authService.generateToken(user);

          res
            .status(200)
            .cookie("Authorization", "Bearer " + token, {
              expires: new Date(Date.now() + 8 * 3600000),
              httpOnly: process.env.NODE_ENV === "production",
              secure: process.env.NODE_ENV === "production",
            })
            .json({ message: "Login successful", Token: token });
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
  }



  async logout(req: Request, res: Response) {
    res.clearCookie("Authorization").json({ message: "Logout successful" });
  }
}
