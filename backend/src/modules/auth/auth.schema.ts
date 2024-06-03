import { roles } from "../../enums/roles.enum";

const registrationSchema = {
  type      : "object",
  properties: {
    name    : { type: "string", minLength: 1, maxLength: 255, },
    email   : { type: "string", format: "email", maxLength: 255, },
    password: {
      type     : "string",
      minLength: 8,
      pattern  : "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]*$"
    },
    role: { enum: [roles.ADMIN, roles.MEMBER] },
  },
  required            : ["name", "email", "password", "role"],
  additionalProperties: false
};


const loginSchema = {
  type      : "object",
  properties: {
    email   : { type: "string", format: "email", maxLength: 255, },
    password: { type: "string" },
  },
  required            : ["email", "password"],
  additionalProperties: false
};

export { registrationSchema, loginSchema };
