const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { getDateDiff } = require("../query/queryMiddlewareHelpers");

const checkUserExist = asyncErrorWrapper(async(req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);

    if (!user){
        return next(new CustomError("There is no such user with that id"),400);
    }
    const dateDiff = getDateDiff(user.createdAt);
    user._doc.dateDiff = dateDiff;
    
    req.data = user;
    next();
});
const checkQuestionExist = asyncErrorWrapper(async(req,res,next) => {
    const question_id = req.params.id || req.params.question_id;

    const question = await Question.findById(question_id)
    .select("-answers")
    .populate({ path: "user", select: "name profile_image role" });

    if (!question) {
        return next(new CustomError("There is no such question with that id"),400);
    }

    const dateDiff = getDateDiff(question.createdAt);
    question._doc.dateDiff = dateDiff;
        
    req.data = question;
    next();
});
const checkQuestionAndAnswerExist = asyncErrorWrapper(async(req,res,next) => {
    const {question_id, answer_id} = req.params;
    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    });
    if (!answer) {
        return next(new CustomError("There is no answer with that id associated with question id"));
    }
    req.data = answer;
    next();
});
const checkAnswerExist = asyncErrorWrapper(async(req,res,next) => {
    const { answer_id } = req.params;
    const answer = await Answer.findOne({ _id: answer_id });
    if (!answer) {
        return next(new CustomError("There is no answer with that id associated with question id"));
    }
    req.data = answer;
    next();
});


module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkQuestionAndAnswerExist,
    checkAnswerExist
};