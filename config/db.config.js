module.exports = {
  HOST: "localhost",
  USER: "mac",
  PASSWORD: "amin1234",
  DB: "tis",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
