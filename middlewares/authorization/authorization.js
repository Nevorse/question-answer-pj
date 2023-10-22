const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {
    isTokenIncluded,
    getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
// const User = require("../../models/User");
// const Question = require("../../models/Question");
// const Answer = require("../../models/Answer");


const getUserIfToken = (req, res, next) => {
    const { access_token } = req.cookies;
    const { JWT_SECRET_KEY } = process.env;

    jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next();
        }
        req.user = {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            profile_image: decoded.profile_image
        };
        next();
    });
}
const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    const access_token = req.cookies.access_token;
    if (!access_token) 
    return next(new CustomError("You are not authorized to access this route",401));

    // if (!isTokenIncluded(req)) {
    //     return next(new CustomError("You are not authorized to access this route",401))
    // }
    // const access_token = getAccessTokenFromHeader(req);

    jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route",401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            profile_image: decoded.profile_image
        };
        next();
    });
};
const getAccessToRouteRedirectBack = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    const access_token = req.cookies.access_token;
    if (!access_token) 
    return next(new CustomError("You are not authorized to access this route",4011));

    jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route",4011));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            profile_image: decoded.profile_image
        };
        next();
    });
};
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { role } = req.user;

    // const user = await User.findById(id);

    if (role !== "admin") {
        return next(new CustomError("Only admins can access this route",403));
    }
    next();
});
const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    question = req.data;

    if (!((question.user._id == userId) || (userRole === "admin"))) {
        return next(new CustomError("Only owner can handle this operation",403));
    }
    next();
});
const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    // const answerId = req.params.asnwer_id;
    // const answer = await Answer.findById(answerId);
    const answer = req.data;

    if (!((answer.user._id == userId) || (userRole === "admin"))) {
        return next(new CustomError("Only owner can handle this operation",403));
    }
    next();
});


module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess,
    getUserIfToken,
    getAccessToRouteRedirectBack
};
