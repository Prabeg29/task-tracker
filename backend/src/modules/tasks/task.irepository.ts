import { TaskCreateDto, TaskQueryDto, TaskWithUsers } from "./task.type";
import { PaginationInfo } from "../../utils/db.util";

export interface TaskRepositoryInterface {
  fetchAllPaginated(taskQuery: TaskQueryDto): Promise<{ data: TaskWithUsers[]; paginationInfo: PaginationInfo; }>;
  fetchOneById(id: number): Promise<TaskWithUsers | undefined>;
  create(taskData: TaskCreateDto): Promise<TaskWithUsers>;
  delete(id: number): Promise<number>;
}
