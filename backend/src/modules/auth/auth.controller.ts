import { Request, Response } from "express";

import { User } from "../users/user.type";
import { AuthService } from "./auth.service";
import { UserMapper } from "../users/user.mapper";
import { StatusCodes } from "../../enums/status-codes.enum";

export class AuthController {
  constructor(
    protected readonly authService: AuthService,
  ) { }

  public googleConsent =  (_req: Request, res: Response): void => {
    res.status(StatusCodes.OK).json({
      message: "Please visit the following link",
      link   : this.authService.getConsentUrl()
    });
  };

  public googleCallback = async (req: Request, res: Response): Promise<void> => {
    const user: User & { accessToken: string; refreshToken: string; } = await this.authService.login(req.body.code as string);
    
    res.status(StatusCodes.OK)
      .cookie("accessToken", user.accessToken, {
        maxAge  : 84600000,
        secure  : true,
        httpOnly: true,
        sameSite: "lax",
        path    : "/"
      })
      .json({ user: UserMapper.toResponseDto(user) });
  };

  public generateAccessToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = await this.authService.generateAccessToken(req.body.refreshToken);

    res.status(StatusCodes.OK).json({ accessToken: accessToken });
  };
}
