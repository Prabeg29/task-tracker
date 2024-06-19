export class ValidationException extends Error {
  validationErrors: Array<{ field: string; errors: string[] }>;

  constructor(validationErrors: Array<{ field: string; errors: string[] }>) {
    super();
    this.name = "JsonSchemaValidationError";
    this.validationErrors = validationErrors;
  }
}
