export const AUTH_CONSTANTS = {
  JWT_SECRET_KEY: 'JWT_SECRET',
  JWT_EXPIRES_IN_KEY: 'JWT_EXPIRES_IN',
  ADMIN_USERNAME_KEY: 'ADMIN_USERNAME',
  ADMIN_PASSWORD_KEY: 'ADMIN_PASSWORD',
  DEFAULT_ADMIN_USERNAME: 'admin',
  DEFAULT_ADMIN_PASSWORD: 'admin123',
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  ADMIN_REQUIRED: 'Admin role required',
  USER_NOT_FOUND: 'Admin user not found',
} as const;