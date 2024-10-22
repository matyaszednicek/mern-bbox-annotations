import type { User } from '../models/users.model';

declare global {
  namespace Express {
    interface Request {
      identity?: User;
    }
  }
}
