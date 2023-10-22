const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getSingleUser, getAllUsers } = require("../controllers/userCtrl");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");
const allUsersQueryMiddleware = require("../middlewares/query/allUsersQueryMiddleware");
const { getUserIfToken } = require("../middlewares/authorization/authorization");


router.get("/", allUsersQueryMiddleware(User), getUserIfToken, getAllUsers);
router.get("/:id", getUserIfToken, checkUserExist, getSingleUser);



module.exports = router;