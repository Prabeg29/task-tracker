import bcrypt from "bcrypt";
import { Server } from "http";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { App } from "../../../app";
import { User } from "../../users/user.type";
import { roles } from "../../../enums/roles.enum";
import { refreshDatabase } from "../../../utils/db.util";
import { KnexTaskRepository } from "../knex-task.repository";
import { StatusCodes } from "../../../enums/status-codes.enum";
import { KnexUserRepository } from "../../users/knex-user.repository";

describe("Tasks API", () => {
  let server: Server;
  let response: request.Response;
  let user: User;
  let token: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    await refreshDatabase();
    user = await (new KnexUserRepository()).create({
      name    : "Hari Bahadur",
      email   : "hari.bahadur@mahajodi.com",
      password: bcrypt.hashSync("P@ssword123$", 5),
      role    : roles.SUPER_ADMIN
    });
    server = (new App()).listen(3000);

    response = await request(server)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({ "email": "hari.bahadur@mahajodi.com", "password": "P@ssword123$" });

    token = response.body.user.accessToken;
  });

  afterEach(() => {
    server.close();
  });

  describe("GET: /api/tasks", () => {
    it("should forbid fetching task when user is not authenticated", async () => {
      response = await request(server)
        .get("/api/tasks")
        .set("Accept", "application/json");

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it.skip("should not allow authenticated user to fetch tasks, lacking permission to do so", () => { });

    it("should fetch tasks with pagination info when user is authenticated and has permission", async () => {
      response = await request(server)
        .get("/api/tasks")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.message).toEqual("Tasks fetched successfully");
      expect(response.body.tasks).toBeTruthy();
      expect(response.body).toHaveProperty("meta.paginationInfo");
    });
  });

  describe("POST: /api/tasks", () => {
    it("should forbid task creation when user is not authenticated", async () => {
      response = await request(server)
        .delete("/api/tasks/1")
        .set("Accept", "application/json")
        .send();

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it.skip("should not allow authenticated user to create task, lacking permission to do so", () => { });

    const invalidTaskPayloadSet = [
      // empty
      {},
      // text length > 255
      {
        "title"      : faker.string.alphanumeric(256),
        "description": faker.string.alphanumeric(256),
        "assignedTo" : "",
      },
    ];

    it.each(invalidTaskPayloadSet)("should show validation errors when task input is invalid", async (invalidPayload) => {
      response = await request(server)
        .post("/api/tasks")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPayload);

      expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("should create task from authenticated user allowed, having a valid task input", async () => {
      response = await request(server)
        .post("/api/tasks")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          "title"      : "Task Post API testing",
          "description": faker.string.alphanumeric(100),
        });

      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body.message).toEqual("Task created successfully.");
      expect(response.body.task.attributes.title).toEqual("Task Post API testing");
      expect(response.body.task.attributes.status).toEqual("todo");
      expect(response.body.task.relationships.createdBy.attributes.email).toEqual("hari.bahadur@mahajodi.com");
    });
  });

  describe("GET: /api/tasks/:id", () => {
    it("should forbid fetching task when user is not authenticated", async () => {
      response = await request(server)
        .get("/api/tasks/1")
        .set("Accept", "application/json");

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it.skip("should not allow authenticated user to fetch task, lacking permission to do so", () => { });

    it("should show error message when trying to fetch non-existing task", async () => {
      response = await request(server)
        .get("/api/tasks/1")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toEqual("Task with the given id does not exists");
    });

    it("should fetch task when user is authenticated and has permission", async () => {
      const task = await (new KnexTaskRepository()).create(user.id, { title: "Write a script" });

      response = await request(server)
        .get(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.message).toEqual("Task fetched successfully.");
      expect(response.body.task.id).toEqual(task.id);
      expect(response.body.task.attributes.title).toEqual("Write a script");
      expect(response.body.task.attributes.status).toEqual("todo");
      expect(response.body.task.relationships.createdBy.attributes.email).toEqual("hari.bahadur@mahajodi.com");
    });
  });

  describe("PUT: /api/tasks/:id", () => {
    it("should forbid task updation when user is not authenticated", async () => {
      response = await request(server)
        .put("/api/tasks/1")
        .set("Accept", "application/json")
        .send();

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it.skip("should not allow authenticated user to update task, lacking permission to do so", () => { });

    const invalidPayloadSet = [
      // empty
      {},
      // text length > 255
      {
        "title"      : faker.string.alphanumeric(256),
        "description": faker.string.alphanumeric(256),
        "assignedTo" : 1,
        "status"     : "",
      },
    ];

    it.each(invalidPayloadSet)("should show validation errors when task input is invalid", async (invalidPayload) => {
      const task = await (new KnexTaskRepository()).create(user.id, { title: "Write a script" });

      response = await request(server)
        .put(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPayload);
      
      expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("should update task from authenticated user allowed, having a valid task input", async () => {
      const task = await (new KnexTaskRepository()).create(user.id, {
        title: "Write a script"
      });

      token = response.body.user.accessToken;

      response = await request(server)
        .put(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          "title"      : "Write a script update",
          "description": faker.string.alphanumeric(100),
          "assignedTo" : 1,
          "status"     : "wip",
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.message).toEqual("Task updated successfully");
      expect(response.body.task.attributes.title).toEqual("Write a script update");
      expect(response.body.task.attributes.status).toEqual("wip");
      expect(response.body.task.relationships.createdBy.attributes.email).toEqual("hari.bahadur@mahajodi.com");
      expect(response.body.task.relationships.assignedTo.attributes.email).toEqual("hari.bahadur@mahajodi.com");
    });
  });

  describe("DELETE: /api/tasks/:id", () => {
    it("should forbid task deletion when user is not authenticated", async () => {
      response = await request(server)
        .delete("/api/tasks/1")
        .set("Accept", "application/json");

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it("should not allow authenticated user to delete task, lacking permission to do so", async () => {
      user = await (new KnexUserRepository()).create({
        name    : "Madan Bahadur",
        email   : "madan.bahadur@mahajodi.com",
        password: bcrypt.hashSync("P@ssword123$", 5),
        role    : roles.MEMBER
      });

      const task = await (new KnexTaskRepository()).create(user.id, { title: "Write a script" });

      response = await request(server)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .send({ "email": "madan.bahadur@mahajodi.com", "password": "P@ssword123$" });

      token = response.body.user.accessToken;

      response = await request(server)
        .delete(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.FORBIDDEN);
      expect(response.body.message).toEqual("Unauthorized to access the resource");
    });

    it("should show error message when trying to delete non-existing task", async () => {
      response = await request(server)
        .delete("/api/tasks/1")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toEqual("Task with the given id does not exists");
    });

    it("should allow super admin to archive delete task", async () => {
      const task = await (new KnexTaskRepository()).create(user.id, { title: "Write a script" });

      response = await request(server)
        .delete(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.message).toEqual("Task deleted successfully");
      expect(response.body.task.attributes.deleteAt).not.toBeNull();
    });
  });
});
