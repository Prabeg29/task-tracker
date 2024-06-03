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

type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">;

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
  type?: string
}

export { User, CreateUserDto, UserResponseDto };
