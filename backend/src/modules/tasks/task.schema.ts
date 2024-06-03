const taskCreateSchema = {
  type      : "object",
  properties: {
    title      : { type: "string", minLength: 1, maxLength: 255, },
    description: { type: "string", format: "email", maxLength: 255, },
    assignedTo : { type: "number" },
  },
  required            : ["title"],
  additionalProperties: false
};

const taskUpdateSchema = {
  type      : "object",
  properties: {
    title      : { type: "string", minLength: 1, maxLength: 255, },
    description: { type: "string", format: "email", maxLength: 255, },
    assignedTo : { type: "number" },
    status     : { type: "string"}
  },
  additionalProperties: false
};

export { taskCreateSchema, taskUpdateSchema };
