const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getUser,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    resetPasswordPage,
    editDetails
} = require("../controllers/authCtrl");
const {
    getAccessToRoute,
} = require("../middlewares/authorization/authorization");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");


router.post("/register", register);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post(
    "/upload",
    [getAccessToRoute, profileImageUpload.single("profile_image")],
    imageUpload
);
router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword",resetPasswordPage);
router.post("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);


module.exports = router;
