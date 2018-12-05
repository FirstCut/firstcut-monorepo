
const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: 'firstcut',
  ENV: 'production',
  GRAPHQL_ENDPOINT: '/graphql',
};

export default config;
