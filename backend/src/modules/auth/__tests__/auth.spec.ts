import bcrypt from "bcrypt";
import { Server } from "http";
import request from "supertest";

import { App } from "../../../app";
import { refreshDatabase } from "../../../utils/db.util";
import { StatusCodes } from "../../../enums/status-codes.enum";
import { KnexUserRepository } from "../../users/knex-user.repository";

let server: Server;
let response: request.Response;

describe("POST: /api/auth/register", () => {
  const payload = {
    "name"    : "Prabeg Shakya",
    "email"   : "shakyaprabeg@gmail.com",
    "password": "Password123$",
    "role"    : 2,
  };
  const invalidRegistrationPayloadSet = [
    // empty payload
    {},
    // invalid password
    {
      "name"    : "Prabeg Shakya",
      "email"   : "shakyaprabeg@gmail.com",
      "password": "pass",
      "role"    : 2
    },
    // invalid email
    {
      "name"    : "Prabeg Shakya",
      "email"   : "shakyaprabeg@gmail.com++",
      "password": "pass",
      "role"    : 2
    },
    // invalid role
    {
      "name"    : "Prabeg Shakya",
      "email"   : "shakyaprabeg@gmail.com++",
      "password": "pass",
      "role"    : 1
    },
  ];

  beforeEach(async () => {
    await refreshDatabase();
    server = (new App()).listen(3000);
    jest.clearAllMocks();
  });

  afterEach(() => {
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
    await (new KnexUserRepository()).create({ ...payload, password: bcrypt.hashSync(payload.password, 10) });

    response = await request(server)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(payload);

    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toEqual("User with the provided email already exists");
  });

  it("should return a newly created user", async () => {
    response = await request(server)
      .post("/api/auth/register")
      .set("Accept", "application/json")
      .send(payload);

    expect(response.status).toEqual(StatusCodes.CREATED);
    expect(response.body.message).toEqual("Registration successful.");
    expect(response.body.user.attributes).toMatchObject({
      name : "Prabeg Shakya",
      email: "shakyaprabeg@gmail.com",
      role : "admin",
    });
  });
});

describe("POST: /api/auth/login", () => {
  beforeEach(async () => {
    await refreshDatabase();
    server = (new App()).listen(3000);
    jest.clearAllMocks();
    await (new KnexUserRepository()).create({
      name    : "Prabeg Shakya",
      email   : "shakyaprabeg@gmail.com",
      password: bcrypt.hashSync("Password123$", 10),
      role    : 2,
    });
  });

  afterEach(() => {
    server.close();
  });

  it("should throw exception when credentials are invalid", async () => {
    response = await request(server)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({ "email": "shakyaprabeg@gmail.com", "password": "Password12" });

    expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toEqual("Invalid credentials");
  });

  it("should return a loggedin user with access token", async () => {
    response = await request(server)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({ "email": "shakyaprabeg@gmail.com", "password": "Password123$" });

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.message).toEqual("Login successful.");
    expect(response.body.user.accessToken).toBeTruthy;
    expect(response.body.user.attributes).toMatchObject({
      name : "Prabeg Shakya",
      email: "shakyaprabeg@gmail.com",
      role : "admin",
    });
  });
});
