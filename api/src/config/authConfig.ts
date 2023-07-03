export default () => ({
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiry: process.env.JWT_EXPIRY,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
});
