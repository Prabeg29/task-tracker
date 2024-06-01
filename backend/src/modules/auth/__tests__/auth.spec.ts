import bcrypt from "bcrypt";
import { Server } from "http";
import request from "supertest";
import { StatusCodes } from 'http-status-codes';

import { App } from "../../../app";
import { dbConn, refreshDatabase } from "../../../utils/db.util";
import { KnexUserRepository } from "../../users/knex-user.repository";

describe("POST: /api/auth/register", () => {
  const server: Server = (new App()).listen(3000);
  let response: request.Response;

  const personalInformation = {
    fullName: "Prabeg Shakya",
    email: "shakyaprabeg@gmail.com",
    password: bcrypt.hashSync("Password123$", 10),
  };

  beforeEach(async () => {
    // await refreshDatabase();
    // jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  const invalidRegistrationPayloadSet = [
    // empty payload
    {},
    // invalid password
    {
      "fullName": "Prabeg Shakya",
      "email": "shakyaprabeg@gmail.com",
      "password": "pass"
    },
    // invalid email
    {
      "fullName": "Prabeg Shakya",
      "email": "shakyaprabeg@gmail.com++",
      "password": "pass"
    },
  ];

  it.each(invalidRegistrationPayloadSet)("should throw validation errors", async (invalidRegistrationPayload) => {
    response = await request(server)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(invalidRegistrationPayloadSet);

    expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
  });

  // it("should throw exception when the email provided already exits", async () => {
  //   await (new KnexUserRepository(dbConn)).create(personalInformation);

  //   const payload = {
  //     "fullName": "Prabeg Shakya",
  //     "email": "shakyaprabeg@gmail.com",
  //     "password": "Password123$"
  //   };

  //   response = await request(server)
  //     .post("/api/auth/signup")
  //     .set("Accept", "application/json")
  //     .send(payload);

  //   expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
  //   expect(response.body.message).toEqual("Company and User already exists");
  // });

  // it("should return a newly created user", async () => {
  //   const payload = {
  //     "fullName": "Prabeg Shakya",
  //     "email": "shakyaprabeg@gmail.com",
  //     "password": "Password123$"
  //   };

  //   response = await request(server)
  //     .post("/api/auth/signup")
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
