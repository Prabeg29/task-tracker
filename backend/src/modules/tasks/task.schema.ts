const taskCreateSchema = {
  type      : "object",
  properties: {
    title      : { type: "string", minLength: 1, maxLength: 255, },
    description: { type: "string", maxLength: 255, },
    assignedTo : { type: "number" },
  },
  required            : ["title"],
  additionalProperties: false
};

const taskUpdateSchema = {
  type      : "object",
  properties: {
    title      : { type: "string", minLength: 1, maxLength: 255, },
    description: { type: "string", maxLength: 255, },
    assignedTo : { type: ["number", "null"] },
    status     : { type: "string"}
  },
  required            : ["title", "status"],
  additionalProperties: false
};

export { taskCreateSchema, taskUpdateSchema };
