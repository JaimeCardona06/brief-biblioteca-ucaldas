class AppError extends Error {
  constructor(message, status = 500, code = 'error') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

class BadRequest extends AppError {
  constructor(message = 'Bad Request', code = 'bad_request') {
    super(message, 400, code);
  }
}

class NotFound extends AppError {
  constructor(message = 'Not Found', code = 'not_found') {
    super(message, 404, code);
  }
}

class Conflict extends AppError {
  constructor(message = 'Conflict', code = 'conflict') {
    super(message, 409, code);
  }
}

module.exports = { AppError, BadRequest, NotFound, Conflict };
