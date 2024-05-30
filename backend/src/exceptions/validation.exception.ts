export class ValidationException extends Error {
  validationErrors: any;

  constructor(validationErrors: any) {
    super();
    this.name = 'JsonSchemaValidationError';
    this.validationErrors = validationErrors;
  }
}
