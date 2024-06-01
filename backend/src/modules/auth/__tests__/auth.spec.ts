import bcrypt from "bcrypt";
import { Server } from "http";
import request from "supertest";
import { StatusCodes } from 'http-status-codes';

import { App } from "../../../app";
import { dbConn, refreshDatabase } from "../../../utils/db.util";
import { KnexUserRepository } from "../../users/knex-user.repository";

describe("POST: /api/auth/register", () => {
  const server: Server = (new App()).listen(3000);
  const payload = {
    "name": "Prabeg Shakya",
    "email": "shakyaprabeg@gmail.com",
    "password": "Password123$",
    "role": 2
  };
  const invalidRegistrationPayloadSet = [
    // empty payload
    {},
    // invalid password
    {
      "name": "Prabeg Shakya",
      "email": "shakyaprabeg@gmail.com",
      "password": "pass",
      "role": 2
    },
    // invalid email
    {
      "name": "Prabeg Shakya",
      "email": "shakyaprabeg@gmail.com++",
      "password": "pass",
      "role": 2
    },
    // invalid role
    {
      "name": "Prabeg Shakya",
      "email": "shakyaprabeg@gmail.com++",
      "password": "pass",
      "role": 1
    },
  ];

  let response: request.Response;

  beforeEach(async () => {
    await refreshDatabase();
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it.each(invalidRegistrationPayloadSet)("should throw validation errors", async (invalidRegistrationPayload) => {
    response = await request(server)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(invalidRegistrationPayload);

    expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("should throw exception when the email provided already exits", async () => {
    await (new KnexUserRepository(dbConn)).create({ ...payload, password: bcrypt.hashSync(payload.password, 10) });

    response = await request(server)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(payload);

    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toEqual("User with the provided email already exists");
  });

  // it("should return a newly created user", async () => {
  //   response = await request(server)
  //     .post("/api/auth/register")
  //     .set("Accept", "application/json")
  //     .send(payload);

  //   expect(response.status).toEqual(StatusCodes.CREATED);
  //   expect(response.body.message).toEqual("Account registered successfully.");
  //   expect(response.body.data.attributes).toMatchObject({
  //     name: "Prabeg Shakya",
  //     email: "shakyaprabeg@gmail.com",
  //     role: "admin",
  //   });
  // });
});
