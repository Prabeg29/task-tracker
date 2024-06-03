import { TaskCreateDto, TaskQueryDto, TaskUpdateDto, TaskWithUsers } from "./task.type";
import { PaginationInfo } from "../../utils/db.util";
import { TaskRepositoryInterface } from "./task.irepository";
import { HttpException } from "../../exceptions/http.exception";
import { StatusCodes } from "http-status-codes";

export class TaskService {
  constructor(
    protected readonly taskRepository: TaskRepositoryInterface
  ) {}

  public async fetchAllPaginated(taskQuery: TaskQueryDto): Promise<{ data: TaskWithUsers[]; paginationInfo: PaginationInfo; }> {
    return await this.taskRepository.fetchAllPaginated({
      ...taskQuery,
      currentPage: Number(taskQuery.currentPage)|| 1,
      perPage    : Number(taskQuery.perPage)|| 25,
    } as TaskQueryDto);
  }

  public async fetchOneById(id: number): Promise<TaskWithUsers> {
    const task: TaskWithUsers =  await this.taskRepository.fetchOneById(id);

    if (!task) {
      throw new HttpException("Task with the given id does not exists", StatusCodes.NOT_FOUND);
    }

    return task;
  }

  public async create(taskData: TaskCreateDto): Promise<TaskWithUsers> {
    return await this.taskRepository.create(taskData);
  }

  public async update(id: number, taskData: TaskUpdateDto): Promise<TaskWithUsers> {
    const task: TaskWithUsers = await this.fetchOneById(id);

    if (!task) {
      throw new HttpException("Task with the provided id does not exists", StatusCodes.BAD_REQUEST);
    }
  
    return await this.taskRepository.update(id, taskData);
  }

  public async delete(id: number): Promise<void> {
    const task: TaskWithUsers = await this.fetchOneById(id);

    const result = await this.taskRepository.delete(task.id);

    if (!result) {
      throw new Error("Error while deleting artist");
    }
  }
}
