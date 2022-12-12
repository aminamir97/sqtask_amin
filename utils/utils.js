var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function emailValidation(email) {
  var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  console.log("email = ", emailRegex.test(email));
  if (!emailRegex.test(email))
    throw {
      message: "Email Address is not correct",
      statusCode: 400,
    };
}

function passValidation(pass) {
  if (pass.length < 6)
    throw {
      message: "password must be more than 6 digits or chars",
      statusCode: 400,
    };
}

async function hasher(pass) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(pass, salt);
  return hashedPass;
}
async function hashCompare(pass, hashed) {
  const comparePass = await bcrypt.compare(pass, hashed);
  if (!comparePass)
    throw { message: "credentials are not found", statusCode: 400 };
}

const jwtGenerator = async (id, role) => {
  const secret = process.env.SECRETJWT;
  var token = jwt.sign({ user: id, role: role }, secret, { expiresIn: "3d" });
  console.log("jwt created successfully = \n", token);
  return token;
};

const jwtChecker = async (token) => {
  const secret = process.env.SECRETJWT;
  try {
    const x = await jwt.verify(token, secret);
    console.log("done jwt check correct");
    return x;
  } catch (error) {
    throw { message: "Token validation error", statusCode: 401 };
  }
};

// const errorRes = (stt, err) => {
//   return {
//     success: false,
//     error: true,
//     message: err,
//     status: stt,
//   };
// };

const successRes = (stt, msg, dtt) => {
  return {
    success: true,
    error: false,
    message: msg,
    status: stt,
    data: dtt,
  };
};

module.exports = {
  emailValidation,
  passValidation,
  jwtGenerator,
  jwtChecker,
  hasher,
  hashCompare,
  successRes,
};
