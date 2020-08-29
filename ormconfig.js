module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME,

  // synchronize:
  //   process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  //     ? true
  //     : false,
  // logging:
  //   process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  //     ? false
  //     : true,
  migrations: ['src/database/migrations/**/*.ts'],
  entities: ['src/app/models/**/*.ts'],
  // subscribers: ['src/app/subscribers/**/*.ts'],
  // seeds: ['src/database/seeds/**/*.seed.ts'],
  // factories: ['src/database/factories/**/*.factory.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/app/models',
    // subscribersDir: 'src/app/subscribers',
  },
};
