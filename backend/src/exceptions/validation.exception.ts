export class ValidationException extends Error {
  validationErrors: { [key: string]: string[] };

  constructor(validationErrors: { [key: string]: string[] }) {
    super();
    this.name = "JsonSchemaValidationError";
    this.validationErrors = validationErrors;
  }
}
