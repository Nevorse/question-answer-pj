const express = require("express");
const router = express.Router();
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/authorization");
const {blockUser, deleteUser} = require("../controllers/adminCtrl");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");


router.use([getAccessToRoute,getAdminAccess]);

router.get("/block/:id",checkUserExist,blockUser);
router.delete("/user/:id",checkUserExist,deleteUser);


module.exports = router;