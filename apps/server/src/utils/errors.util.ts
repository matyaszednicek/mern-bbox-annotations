import { HttpStatusCode } from 'axios';

export class UserFacingError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = 400) {
    super(message);
    this.name = 'UserFacingError';
    this.statusCode = statusCode;
  }
}
