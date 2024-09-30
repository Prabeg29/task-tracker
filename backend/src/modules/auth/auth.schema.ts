export const loginSchema = {
  type      : "object",
  properties: {
    state: { type: "string" },
    code : { type: "string" },
  },
  required            : ["state", "code"],
  additionalProperties: false
};
