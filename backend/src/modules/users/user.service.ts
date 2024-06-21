import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../../config";
import { roles } from "../../enums/roles.enum";
import { CreateUserDto, User } from "./user.type";
import { StatusCodes } from "../../enums/status-codes.enum";
import { UserRepositoryInterface } from "./user.irepository";
import { HttpException } from "../../exceptions/http.exception";

export class UserService {
  constructor(
    protected readonly userRepository: UserRepositoryInterface
  ) {}

  public async create(userData: CreateUserDto): Promise<User & { accessToken: string; refreshToken: string; }> {
    const isExistingUser = await this.userRepository.fetchOneByEmail(userData.email);

    if (isExistingUser) {
      throw new HttpException("User with the provided email already exists",StatusCodes.BAD_REQUEST);
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    const user =  await this.userRepository.create(userData);

    return {
      ...user,
      accessToken: jwt.sign(
        { id: user.id, email: user.email, role: roles[user.role] }, 
        config.secrets.jwt, 
        { expiresIn: "10m" }
      ),
      refreshToken: jwt.sign(
        { id: user.id, email: user.email, role: roles[user.role] }, 
        config.secrets.refreshJwt, 
        { expiresIn: "7d" }
      )
    };
  }

  public async signin(userData: Partial<CreateUserDto>): Promise<User & { accessToken: string; refreshToken: string; }> {
    const isExistingUser = await this.userRepository.fetchOneByEmail(userData.email);

    if (!isExistingUser) {
      throw new HttpException("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(userData.password, isExistingUser.password);

    if (!isPasswordValid) {
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

  public async fetchAll(): Promise<User[]> {
    return await this.userRepository.fetchAll();
  }
}
