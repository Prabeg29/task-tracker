import { TaskService } from "../task.service";
import { PaginationInfo } from "../../../utils/db.util";
import { userStub } from "../../users/__tests__/user.stub";
import { KnexTaskRepository } from "../knex-task.repository";
import { TaskRepositoryInterface } from "../task.irepository";
import { HttpException } from "../../../exceptions/http.exception";
import { createTaskDtoStub, taskStub, updateTaskDtoStub } from "./task.stub";
import { TaskCreateDto, TaskQueryDto, TaskUpdateDto, TaskWithUsers } from "../task.type";

describe("Task Service", () => {
  const knexTaskRepository: TaskRepositoryInterface = new KnexTaskRepository();
  const taskService: TaskService = new TaskService(knexTaskRepository);

  let res;
  let error: HttpException;

  let mockCreate: jest.SpyInstance<Promise<TaskWithUsers>, [taskData: TaskCreateDto]>;
  let mockFetchOneById: jest.SpyInstance<Promise<TaskWithUsers | undefined>, [id: number]>;
  let mockUpdate: jest.SpyInstance<Promise<TaskWithUsers>, [id: number, taskData: TaskUpdateDto]>;
  let mockDelete: jest.SpyInstance<Promise<number>, [id: number]>;
  let mockFetchAllPaginated: jest.SpyInstance<
    Promise<{ data: TaskWithUsers[]; paginationInfo: PaginationInfo; }>, [taskQuery: TaskQueryDto]
  >;

  beforeEach(() => {
    mockCreate = jest.spyOn(knexTaskRepository, "create");
    mockFetchOneById = jest.spyOn(knexTaskRepository, "fetchOneById");
    mockUpdate = jest.spyOn(knexTaskRepository, "update");
    mockDelete = jest.spyOn(knexTaskRepository, "delete");
    mockFetchAllPaginated = jest.spyOn(knexTaskRepository, "fetchAllPaginated");
  });

  afterEach(() => jest.clearAllMocks());

  describe("fetchAllPaginated", () => {
    it("should return array of tasks with paginated info", async () => {
      const paginationInfo = {
        total      : 1,
        perPage    : 1,
        currentPage: 1,
        lastPage   : 1,
        prevPage   : null,
        nextPage   : null,
      } as PaginationInfo;

      const taskQuery: TaskQueryDto = {};

      mockFetchAllPaginated.mockResolvedValue({ data: taskStub(), paginationInfo });

      const res = await taskService.fetchAllPaginated(taskQuery);

      expect(mockFetchAllPaginated).toHaveBeenCalledWith(1, 1);
      expect(res).toMatchObject({ data: taskStub(), paginationInfo });
    });
  });

  describe("create", () => {
    it("should create a task", async () => {
      mockCreate.mockResolvedValue(taskStub()[0]);

      res = await taskService.create(createTaskDtoStub());

      expect(mockCreate).toHaveBeenCalledWith(createTaskDtoStub());
      expect(res).toMatchObject(taskStub()[0]);
    });
  });

  describe("fetchOneById", () => {
    it("should throw error when user doesn\"t exist", async () => {
      mockFetchOneById.mockResolvedValue(undefined);

      try {
        res = await taskService.fetchOneById(23);
      } catch (err) {
        error = err as HttpException;
      }

      expect(mockFetchOneById).toHaveBeenCalledWith(23);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe("Task with the given id does not exists");
      expect(error.statusCode).toBe(404);
    });

    it("should return the existing task", async () => {
      mockFetchOneById.mockResolvedValue(taskStub()[0]);

      res = await taskService.fetchOneById(taskStub()[0].id);

      expect(res).toMatchObject(taskStub()[0]);
    });
  });

  describe("update", () => {
    it("should throw exception when trying to update a non existing task", async () => {
      mockFetchOneById.mockResolvedValue(undefined);
    
      try {
        await taskService.update(42, updateTaskDtoStub());
      } catch (err) {
        error = err as HttpException;
      }

      expect(mockFetchOneById).toHaveBeenCalledWith(42);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe("Task with the given id does not exists");
      expect(error.statusCode).toBe(404);
    });

    it("should update the task", async () => {
      mockFetchOneById.mockResolvedValue(taskStub()[0]);

      mockUpdate.mockResolvedValue({ ...taskStub()[0], status: updateTaskDtoStub().status, assignedTo: userStub()[0] });
      
      res = await taskService.update(taskStub()[0].id, updateTaskDtoStub());

      expect(mockUpdate).toHaveBeenCalledWith(userStub()[0].id, updateTaskDtoStub());
      expect(res).toMatchObject({ ...taskStub()[0], status: updateTaskDtoStub().status, assignedTo: userStub()[0] });
    });
  });

  describe("delete", () => {
    it("should delete the task with the corresponding id", async () => {
      mockFetchOneById.mockResolvedValue(taskStub()[0]);
      mockDelete.mockResolvedValue(1);
    
      await taskService.delete(userStub()[0].id);

      expect(mockFetchOneById).toHaveBeenCalledWith(userStub()[0].id);
      expect(mockDelete).toHaveBeenCalledWith(userStub()[0].id);
    });
  });
});
