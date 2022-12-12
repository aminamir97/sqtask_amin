const { Router } = require("express");
const router = Router();
const users = require("../controllers/user.controller");
const { user } = require("../models");

router.post("/login", users.login);

router.post("/register", users.register);

router.get("/", users.getUser);

router.delete("/", users.deleteUser);

router.put("/", users.editUser);

module.exports = router;
