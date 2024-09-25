type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

type CreateUserDto = Pick<User, "name" | "email" | "password" | "role">;

type UserResponseDto = {
  id: number;
  attributes: {
    name: string,
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  },
  accessToken?: string,
  type?: string,
  refreshToken?: string,
}

export { CreateUserDto, User, UserResponseDto };
