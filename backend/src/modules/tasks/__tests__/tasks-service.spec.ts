import { HttpException } from "../../../exceptions/http.exception";
import { KnexTaskRepository } from "../knex-task.repository";
import { TaskRepositoryInterface } from "../task.irepository";
import { TaskService } from "../task.service";
import { TaskCreateDto, TaskWithUsers } from "../task.type";
import { createTaskDtoStub, taskStub } from "./task.stub";

describe("Task Service", () => {
  const knexTaskRepository: TaskRepositoryInterface = new KnexTaskRepository();
  const taskService: TaskService = new TaskService(knexTaskRepository);

  let res;
  let error: HttpException;

  let mockCreate: jest.SpyInstance<Promise<TaskWithUsers>, [taskData: TaskCreateDto]>;
  let mockFetchOneById: jest.SpyInstance<Promise<TaskWithUsers | undefined>, [id: number]>;

  beforeEach(() => {
    mockCreate = jest.spyOn(knexTaskRepository, "create");
    mockFetchOneById = jest.spyOn(knexTaskRepository, "fetchOneById");
  });

  afterEach(() => jest.clearAllMocks());

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
});
