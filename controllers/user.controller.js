const { user } = require("../models");
const db = require("../models");
const utils = require("../utils/utils");
const Op = db.Sequelize.Op;

const userDataValidator = (data) => {
  const { first_name, last_name, username, password, email } = data;
  if (!first_name || !last_name || !username || !password || !email) {
    throw { message: "missing payload data", statusCode: 400 };
  } else {
    return data;
  }
};
const loginDataValidator = (data) => {
  const { un_or_em, password } = data;
  if (!un_or_em || !password) {
    throw { message: "missing payload data", statusCode: 400 };
  } else {
    return data;
  }
};
const editUserValidator = (data) => {
  //only accept name and email to be updated because username and password mustn't be changable
  const { first_name, last_name, email } = data;
  if (!(first_name || last_name || email)) {
    throw {
      message: "firstname ,email or lastname must be added",
      statusCode: 400,
    };
  } else {
    return data;
  }
};

//BEGIN register
//Validate the body data
//hash the given password ,
//insert the new user ,
//if username already taken , give a error message
//END
exports.register = async (req, res, next) => {
  try {
    const obj = userDataValidator(req.body);
    utils.passValidation(obj.password.toString());
    const hashedPass = await utils.hasher(obj.password);
    obj.password = hashedPass;
    // Save user in the database
    user
      .create(obj)
      .then((data) => {
        const resp = utils.successRes(200, "Regisered successfully", data);
        res.status(200).send(resp);
      })
      .catch((err) => {
        console.log(err);
        next({ message: err.parent.detail, statusCode: 400 });
      });
  } catch (error) {
    next(error);
  }
};

//BEGIN
//Validate the body data
//check username or email if exists
//compare the hashed password with the sent coming one
//THEN
//create new Token ,
//send userid , role , token , activity status
//END
exports.login = async (req, res, next) => {
  try {
    const obj = loginDataValidator(req.body);
    utils.passValidation(obj.password.toString());
    const foundUser = await user.findOne({
      where: { [Op.or]: [{ email: obj.un_or_em }, { username: obj.un_or_em }] },
    });
    if (!foundUser) throw { message: "user is not exists", statusCode: 400 };
    await utils.hashCompare(obj.password, foundUser.password);
    const tok = await utils.jwtGenerator(foundUser.id, "user_st");
    const respUserInfo = {
      uid: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      token: tok,
      role: "user_st",
    };
    const response = utils.successRes(200, "login success", respUserInfo);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

//get one user
exports.getUser = async (req, res, next) => {
  try {
    const uid = req.jwt.user;
    const foundUser = await user.findByPk(uid);
    if (!foundUser) throw { message: "user not found", statusCode: 400 };
    foundUser.password = "*******";
    const resp = utils.successRes(200, "user found", foundUser);
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

//delete the user
exports.deleteUser = async (req, res, next) => {
  try {
    const uid = req.jwt.user;
    const deletingUser = await user.destroy({
      where: { id: uid },
    });
    //deletingUser :  will return 0 ,1 as true , false for deleting operation
    if (deletingUser != 1)
      throw { message: "error in deleting the user", statusCode: 400 };
    const resp = utils.successRes(200, "user deleted", null);
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

//edit the user
exports.editUser = async (req, res, next) => {
  try {
    const uid = req.jwt.user;
    const obj = editUserValidator(req.body);
    const updateUser = await user.update(
      {
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
      },
      { where: { id: uid } }
    );
    if (updateUser != 1)
      throw { message: "error while updating user", statusCode: 400 };

    const resp = utils.successRes(200, "user updated", null);
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};
