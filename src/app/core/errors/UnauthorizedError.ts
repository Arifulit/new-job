import ApiError from "./ApiError";

export default class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}
