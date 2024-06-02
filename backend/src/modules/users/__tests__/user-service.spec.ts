import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserService } from "../user.service";
import { User, CreateUserDto } from "../user.type";
import { createUserDtoStub, userStub } from "./user.stub";
import { KnexUserRepository } from "../knex-user.repository";
import { HttpException } from "../../../exceptions/http.exception";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  const knexUserRepository: KnexUserRepository = new KnexUserRepository();
  const userService: UserService = new UserService(knexUserRepository);

  let mockFetchOneByEmail: jest.SpyInstance<Promise<User | undefined>, [email: string]>;
  let mockCreate: jest.SpyInstance<Promise<User>, [userData: CreateUserDto]>;

  let res;
  let error: HttpException;

  beforeEach(() => {
    mockFetchOneByEmail = jest.spyOn(knexUserRepository, "fetchOneByEmail");
    mockCreate = jest.spyOn(knexUserRepository, "create");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should throw HttpException when user email is not unique", async () => {
      mockFetchOneByEmail.mockResolvedValue(userStub()[0]);

      try {
        res = await userService.create(createUserDtoStub());
      } catch (err) {
        error = err as HttpException;
      }

      expect(mockFetchOneByEmail).toHaveBeenCalledWith(createUserDtoStub().email);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe("User with the provided email already exists");
      expect(error.statusCode).toBe(400);
    });

    it("should create a user with unique email", async () => {
      mockFetchOneByEmail.mockResolvedValue(undefined);
      mockCreate.mockResolvedValue(userStub()[0]);

      res = await userService.create(createUserDtoStub());

      expect(mockFetchOneByEmail).toHaveBeenCalledWith(createUserDtoStub().email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDtoStub().password, 10);
      expect(mockCreate).toHaveBeenCalledWith({ ...createUserDtoStub(), password: undefined });
      expect(res).toMatchObject(userStub()[0]);
    });
  });

  describe("signin", () => {
    it("should throw HttpException when user does not exist", async () => {
      mockFetchOneByEmail.mockResolvedValue(undefined);

      try {
        res = await userService.signin(createUserDtoStub());
      } catch (err) {
        error = err as HttpException;
      }

      expect(mockFetchOneByEmail).toHaveBeenCalledWith(createUserDtoStub().email);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe("Invalid credentials");
      expect(error.statusCode).toBe(401);
    });

    it("should throw HttpException when password is invalid", async () => {
      mockFetchOneByEmail.mockResolvedValue(userStub()[0]);
      bcrypt.compare = jest.fn(() => Promise.resolve(false));

      try {
        res = await userService.signin(createUserDtoStub());
      } catch (err) {
        error = err as HttpException;
      }

      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe("Invalid credentials");
      expect(error.statusCode).toBe(401);
    });

    it("should return user with access token when credentials are valid", async () => {
      mockFetchOneByEmail.mockResolvedValue(userStub()[0]);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("dummy-jwt-token");

      res = await userService.signin(createUserDtoStub());

      expect(res).toMatchObject({ ...userStub()[0], token: "dummy-jwt-token" });
    });
  });
});
