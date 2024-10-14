import { createUser, getUserByEmail } from '../models/users.model';
import { authentication, randomString } from '../utils/auth.util';
import { UserFacingError } from '../utils/errors.util';

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  if (!isValidEmail(email)) {
    throw new UserFacingError('Invalid email format');
  }
  if (!isValidUsername(username)) {
    throw new UserFacingError(
      'Username must be at least 3 characters long and contain only letters and numbers'
    );
  }
  if (!isValidPassword(password)) {
    throw new UserFacingError(
      'Password must be at least 8 characters long and include number and special character'
    );
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new UserFacingError('User already exists');
  }

  const salt = randomString();
  const user = await createUser({
    username,
    email,
    authentication: {
      salt,
      password: authentication(salt, password),
    },
  });

  return user;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
  return usernameRegex.test(username);
};

const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/;
  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email).select(
    '+authentication.salt +authentication.password'
  );

  if (!user) {
    throw new UserFacingError('User not found');
  }

  const expectedHash = authentication(user.authentication.salt, password);

  if (expectedHash !== user.authentication.password) {
    throw new UserFacingError('Invalid password', 403);
  }

  const salt = randomString();
  user.authentication.sessionToken = authentication(salt, user._id.toString());

  await user.save();

  return user;
};
