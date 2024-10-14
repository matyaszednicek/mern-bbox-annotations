import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'auth-secret';

export const randomString = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac('sha512', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex');
};
