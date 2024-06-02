import { User, UserResponseDto } from "../users/user.type";

type Task = {
  id: number;
  title: string;
  description?: string;
  createdBy: number,
  assignedTo?: number,
  status: string,
  completedAt?: Date,
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

type TaskWithUsers = Omit<Task, 'createdBy' | 'assignedTo'> & { createdBy: User, assignedTo?: User};

type TaskQueryDto = {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  currentPage?: string | number;
  perPage?: string | number;
};

type TaskCreateDto = Omit<Task, 'id' | 'createdBy' | 'status' | 'completedAt' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
type TaskUpdateDto = Partial<TaskCreateDto> & { status: string };

type TaskResponseDto = {
  id: number;
  attributes: {
    title: string,
    description?: string;
    status: string,
    completedAt?: string,
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  },
  relationships: {
    createdBy: UserResponseDto,
    assignedTo: UserResponseDto,
  }
}

export { Task, TaskWithUsers, TaskQueryDto, TaskCreateDto, TaskUpdateDto, TaskResponseDto };
