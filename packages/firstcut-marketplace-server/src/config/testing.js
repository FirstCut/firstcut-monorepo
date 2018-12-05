
const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: 'firstcut-test',
  ENV: 'testing',
  GRAPHQL_ENDPOINT: '/graphql',
};

export default config;
