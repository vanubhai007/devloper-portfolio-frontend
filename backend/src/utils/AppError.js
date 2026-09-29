/** Operational error with an HTTP status code, safe to show to clients. */
export class AppError extends Error {
  constructor(message, statusCode = 500, errors) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
    this.isOperational = true;
  }
}
