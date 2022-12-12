module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING(255),
    },
    username: {
      type: Sequelize.STRING(255),
      unique: true,
    },
    email: {
      type: Sequelize.STRING(255),
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
    },
  });

  return User;
};
