const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
    validateUserInput,
    comparePassword,
} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sentEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    let user

    try{
        user = await User.create({
            name,
            email,
            password,
            role,
        });
    } catch(err) {
        if (err.name === "MongoServerError" && err.code === 11000)
        return next(new CustomError("Duplicate Key Found : Check Your Input", 40012));
        else if (err.errors.password) 
        return next(new CustomError(err.errors.password.message, 40012));
        else if (err.errors.name) 
        return next(new CustomError(err.errors.name.message, 40012));
        else if (err.errors.email) 
        return next(new CustomError(err.errors.email.message, 40012));
    }
    
    sendJwtToClient(user, res);
});
const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name,
        },
    });
};
const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs", 40011));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new CustomError("Please check your credentials", 40011));
    }
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 40011));
    }
    sendJwtToClient(user, res);
});
const logout = asyncErrorWrapper(async (req, res, next) => {
    return res
        .status(200)
        .clearCookie("access_token")
        .redirect("/api/questions");
        // .json({
        //     success: true,
        //     message: "logout successful",
        // });
});
const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { profile_image: req.savedProfileImage },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Image Upload Successful",
        data: user,
    });
});
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail });

    if (!user) {
        return next(new CustomError("There is no user with that email", 40013));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
        <h3>Reset Your Password<h3/>
        <p> This <a href ='${resetPasswordUrl}' target = '_blank'>link<a/> will expire in 1 hour<p>
    `;
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate,
        });
        req.flash("signFormSuccess","Token sent to your email");
        res.status(200)
        .redirect("back");
        // .json({
        //     success: true,
        //     message: "Token Sent To Your Email"
        // });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent"), 500);
    }
});
const resetPasswordPage = asyncErrorWrapper(async (req, res, next) => {
    const query = "resetPasswordToken="+req.query.resetPasswordToken;

    return res.status(200)
    .render("pages/resetPassword.ejs", {
        flashAlert: req.flash(),
        query: query
    });
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query;
    const { password, confirmPassword } = req.body;
    
    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid token"), 400);
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new CustomError("Invalid Token or session Expired",404));
    }
    if (password != "" && password === confirmPassword) {
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
    } else {
        return next(new CustomError("Please check your credentials"));
    }
    
    return res.status(200)
    .redirect("/api/questions");
    // .json({
    //     success: true,
    //     message: "Reset Password Process Successful",
    // });
});
const editDetails = asyncErrorWrapper(async(req, res, next) => {
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators : true
    });
    return res.status(200)
    .json({
        success: true,
        data: user
    });
});


module.exports = {
    register,
    login,
    getUser,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    resetPasswordPage,
    editDetails
};
