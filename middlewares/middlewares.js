const utils = require("../utils/utils");
const tokenMiddleware = async (req, res, next) => {
  try {
    //skip login and register routes
    if (req.url.includes("login") || req.url.includes("register")) {
      console.log("passed route ");
      next();
    } else {
      const headersToken = req.headers.auth;

      if (!headersToken)
        throw { message: "authentication missing error", statusCode: 401 };

      const jwtChecker = await utils.jwtChecker(headersToken);
      req.jwt = jwtChecker;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { tokenMiddleware };
