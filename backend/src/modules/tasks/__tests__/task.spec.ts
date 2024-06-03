import { Server } from "http";
import request from "supertest";

import { App } from "../../../app";
import { refreshDatabase } from "../../../utils/db.util";

describe("Tasks API", () => {
  let server: Server;
  let response: request.Response;

  beforeEach(async () => {
    jest.clearAllMocks();
    await refreshDatabase();
    server = (new App()).listen(3000);
  });

  afterEach(() => {
    server.close();
  });

  describe("GET: /api/tasks", () => {
    it("should forbid fetching task when user is not authenticated", () => {});

    it("should not allow authenticated user to fetch tasks, lacking permission to do so", () => {});

    it("should fetch tasks when user is authenticated and has permission", () => {});
  });

  describe("POST: /api/tasks", () => {
    it("should forbid task creation when user is not authenticated", () => {});

    it("should not allow authenticated user to create task, lacking permission to do so", () => {});

    it("should show validation errors when task input is invalid", () => {});

    it("should create task from authenticated user allowed, having a valid task input", () => {});
  });

  describe("GET: /api/tasks/:id", () => {
    it("should forbid fetching task when user is not authenticated", () => {});

    it("should not allow authenticated user to fetch task, lacking permission to do so", () => {});

    it("should fetch task when user is authenticated and has permission", () => {});
  });

  describe("PUT: /api/tasks/:id", () => {
    it("should forbid task updation when user is not authenticated", () => {});

    it("should not allow authenticated user to update task, lacking permission to do so", () => {});

    it("should show validation errors when task input is invalid", () => {});

    it("should update task from authenticated user allowed, having a valid task input", () => {});
  });

  describe("DELETE: /api/tasks/:id", () => {
    it("should forbid task deletion when user is not authenticated", () => {});

    it("should not allow authenticated user to delete task, lacking permission to do so", () => {});

    it("should delete task from authenticated user allowed, having a valid task input", () => {});
  });
});
