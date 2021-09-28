class noteError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class ValidationError extends noteError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class WrongParametersError extends noteError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class NotAuthorized extends noteError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class RegistrationConflictError extends noteError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  noteError,
  ValidationError,
  NotAuthorized,
  WrongParametersError,
  WrongParametersError,
  RegistrationConflictError,
};
