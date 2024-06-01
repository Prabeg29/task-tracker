import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import config from "../../config";
import { CreateUserDto, User } from "./user.type";
import { UserRepositoryInterface } from "./user.irepository";
import { HttpException } from "../../exceptions/http.exception";

export class UserService {
  constructor(
    protected readonly userRepository: UserRepositoryInterface
  ) {}

  public async create(userData: CreateUserDto): Promise<User> {
    const isExistingUser = await this.userRepository.fetchOneByEmail(userData.email);

    if (isExistingUser) {
      throw new HttpException("User with the provided email already exists",StatusCodes.BAD_REQUEST);
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    return await this.userRepository.create(userData);
  }

  public async signin(userData: Partial<CreateUserDto>): Promise<User & { accessToken: string; }> {
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
        { id: isExistingUser.id, email: isExistingUser.email, role: isExistingUser.role }, 
        config.secrets.jwt, 
        { expiresIn: "10m" }
      )
    };
  }
}
