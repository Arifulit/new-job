import ApiError from "./ApiError";

export default class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
