import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { UserMapper } from "../users/user.mapper";
import { CreateUserDto, User } from "../users/user.type";
import { StatusCodes } from "../../enums/status-codes.enum";

export class AuthController {
  constructor(
    protected readonly authService: AuthService,
  ) { }

  public register = async (req: Request, res: Response): Promise<void> => {
    const user: User & { accessToken: string; refreshToken: string; } = await this.authService.register(req.body as CreateUserDto);

    res.status(StatusCodes.CREATED).json({ message: "Registration successful.", user: UserMapper.toResponseDto(user) });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const user: User & { accessToken: string; refreshToken: string } = await this.authService.login(req.body as Partial<CreateUserDto>);

    res.status(StatusCodes.OK)
      .cookie("accessToken", user.accessToken, {
        maxAge  : 3600000,
        secure  : false,
        httpOnly: true,
        sameSite: "lax",
        path    : "/",
      })
      .cookie("refreshToken", user.refreshToken, {
        maxAge  : 604800000,
        secure  : false,
        httpOnly: true,
        sameSite: "lax",
        path    : "/"
      })
      .json({ user: UserMapper.toResponseDto(user) });
  };

  public googleConsent = (_req: Request, res: Response): void => {
    res.status(StatusCodes.OK).json({
      message: "Please visit the following link",
      link   : this.authService.getConsentUrl()
    });
  };

  public googleCallback = async (req: Request, res: Response): Promise<void> => {
    const user: User & { accessToken: string; refreshToken: string; } = await this.authService.googleLogin(req.body.code as string);

    res.status(StatusCodes.OK)
      .cookie("accessToken", user.accessToken, {
        maxAge  : 3600000,
        secure  : false,
        httpOnly: true,
        sameSite: "lax",
        path    : "/",
      })
      .cookie("refreshToken", user.refreshToken, {
        maxAge  : 604800000,
        secure  : false,
        httpOnly: true,
        sameSite: "lax",
        path    : "/"
      })
      .json({ user: UserMapper.toResponseDto(user) });
  };

  public generateAccessToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = await this.authService.generateAccessToken(req.cookies.refreshToken);

    res.status(StatusCodes.OK)
      .cookie("accessToken", accessToken, {
        maxAge  : 3600000,
        secure  : false,
        httpOnly: true,
        sameSite: "lax",
        path    : "/",
      })
      .json({ message: "Access token generated successfully" });;
  };
}
