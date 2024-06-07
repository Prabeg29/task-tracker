import bcrypt from "bcrypt";
import { Server } from "http";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { App } from "../../../app";
import { refreshDatabase } from "../../../utils/db.util";
import { KnexTaskRepository } from "../knex-task.repository";
import { KnexUserRepository } from "../../users/knex-user.repository";

describe("Tasks API", () => {
  let server: Server;
  let response: request.Response;
  let token: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    await refreshDatabase();
    server = (new App()).listen(3000);
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

    it("should not allow authenticated user to fetch tasks, lacking permission to do so", () => { });

    it("should fetch tasks when user is authenticated and has permission", () => { });
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

    it("should not allow authenticated user to create task, lacking permission to do so", () => { });

    it("should show validation errors when task input is invalid", () => { });

    it("should create task from authenticated user allowed, having a valid task input", () => { });
  });

  describe("GET: /api/tasks/:id", () => {
    it("should forbid fetching task when user is not authenticated", async () => {
      response = await request(server)
        .get("/api/tasks/1")
        .set("Accept", "application/json");

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toEqual("No token provided");
    });

    it("should not allow authenticated user to fetch task, lacking permission to do so", () => { });

    it("should fetch task when user is authenticated and has permission", () => { });
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

    it("should not allow authenticated user to update task, lacking permission to do so", () => { });

    it("should show validation errors when task input is invalid", () => { });

    it("should update task from authenticated user allowed, having a valid task input", () => { });
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
      const user = await (new KnexUserRepository()).create({
        name    : "Hari Bahadur",
        email   : "hari.bahadur@mahajodi.com",
        password: bcrypt.hashSync("P@ssword123$", 5),
        role    : 3
      });

      const task = await (new KnexTaskRepository()).create(user.id, { title: "Write a script" });

      response = await request(server)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .send({ "email": "hari.bahadur@mahajodi.com", "password": "P@ssword123$" });

      token = response.body.user.accessToken;

      response = await request(server)
        .delete(`/api/tasks/${task.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toEqual(StatusCodes.FORBIDDEN);
      expect(response.body.message).toEqual("Unauthorized to access the resource");
    });

    it("should show error message when trying to delete non-existing task", async () => {
      const user = await (new KnexUserRepository()).create({
        name    : "Hari Bahadur",
        email   : "hari.bahadur@mahajodi.com",
        password: bcrypt.hashSync("P@ssword123$", 5),
        role    : 1
      });

      response = await request(server)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .send({ "email": "hari.bahadur@mahajodi.com", "password": "P@ssword123$" });

      token = response.body.user.accessToken;

      response = await request(server)
        .delete("/api/tasks/1")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toEqual("Task with the given id does not exists");
    });


    it("should delete task from authenticated user allowed, having a valid task input", () => { });
  });
});
