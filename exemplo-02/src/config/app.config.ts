export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  api: {
    prefix: process.env.API_PREFIX ?? 'api',
    version: process.env.API_VERSION ?? 'v1',
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'your-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
    adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
  },
});
