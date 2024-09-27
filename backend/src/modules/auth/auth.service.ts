import jwt from "jsonwebtoken";

import config from "../../config";
import { User } from "../users/user.type";
import { roles } from "../../enums/roles.enum";
import { GoogleService } from "../../lib/google.service";
import { StatusCodes } from "../../enums/status-codes.enum";
import { HttpException } from "../../exceptions/http.exception";
import { UserRepositoryInterface } from "../users/user.irepository";

export class AuthService {
  private readonly googleService: GoogleService;

  constructor(
    private readonly userRepository: UserRepositoryInterface
  ) {
    this.googleService = new GoogleService(config.google.oauthClientId, config.google.oauthClientSecret);
  }

  public getConsentUrl(): string {
    return this.googleService.getAuthorizationUrl(config.google.redirectUrl, config.google.scopes.split(","));
  }

  public async login(code: string | null): Promise<User & { accessToken: string; refreshToken: string; }> {
    if (!code) {
      throw new HttpException("Authorization code not found", StatusCodes.NOT_FOUND);
    }

    const token = await this.googleService.getToken(code, config.google.redirectUrl);
    const accessToken = token.access_token;

    if (!accessToken) {
      throw new HttpException("Failed to get access token", StatusCodes.SERVICE_UNAVAILABLE);
    }

    const userInfo = await this.googleService.getUserInfo(accessToken);

    const isExistingUser = await this.userRepository.fetchOneByEmail(userInfo.email);

    if (!isExistingUser) {
      throw new HttpException("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    return {
      ...isExistingUser,
      accessToken: jwt.sign(
        { id: isExistingUser.id, email: isExistingUser.email, role: roles[isExistingUser.role] }, 
        config.secrets.jwt, 
        { expiresIn: "10m" }
      ),
      refreshToken: jwt.sign(
        { id: isExistingUser.id, email: isExistingUser.email, role: roles[isExistingUser.role] }, 
        config.secrets.refreshJwt, 
        { expiresIn: "7d" }
      )
    };
  }

  public async generateAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new HttpException("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const user = jwt.verify(refreshToken, config.secrets.refreshJwt) as { id: number; email: string; role: string };

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      config.secrets.jwt, 
      { expiresIn: "10m" }
    );
  }
}