import { createUser, getUserByEmail } from '../models/users.model';
import { authentication, randomString } from '../utils/auth.util';
import { UserFacingError } from '../utils/errors.util';

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
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

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email).select(
    '+authentication.salt +authentication.password'
  );

  if (!user) {
    throw new UserFacingError('', 401);
  }

  const expectedHash = authentication(user.authentication.salt, password);

  if (expectedHash !== user.authentication.password) {
    throw new UserFacingError('', 401);
  }

  const salt = randomString();
  user.authentication.sessionToken = authentication(salt, user._id.toString());

  await user.save();

  return user;
};
