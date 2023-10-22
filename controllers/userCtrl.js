const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError = require("../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler");
const { getDateDiff } = require("../middlewares/query/queryMiddlewareHelpers");


const getSingleUser = asyncErrorWrapper(async(req,res,next) => {

    const questions_limit = req.query.questions || 5;
    const answers_limit = req.query.answers || 5;

    const questions_count = await Question.countDocuments({user: req.data._id});
    const answers_count = await Answer.countDocuments({user: req.data._id});

    const questions = await Question.find({user: req.data._id})
    .select("title voteCount createdAt").sort("-voteCount -createdAt")
    .limit(questions_limit);
    const answers = await Answer.find({user: req.data._id})
    .select("content voteCount createdAt question index").sort("-voteCount -createdAt")
    .limit(answers_limit);

    for (let i = 0; i < questions.length; i++) {
        const dateDiff = getDateDiff(questions[i].createdAt);
        questions[i]._doc.dateDiff = dateDiff;
    }
    for (let i = 0; i < answers.length; i++) {
        const dateDiff = getDateDiff(answers[i].createdAt);
        answers[i]._doc.dateDiff = dateDiff;
    }
    return res.status(200)
    .render("pages/profile.ejs", {
        res: {
            questions:{
                count: questions_count,
                data: questions
            },
            answers: {
                count: answers_count,
                data: answers
            }
        },
        user: req.user,
        profile: req.data,
        access_token: req.cookies.access_token,
        flashAlert: req.flash(),
    });
    // .json({
    //     success: true,
    //     profile: req.data,
    //     questions:{
    //         count: questions.length,
    //         data: questions
    //     },
    //     answers: {
    //         count: answers.length,
    //         data: answers
    //     }
    // });
});
const getAllUsers = asyncErrorWrapper(async(req,res,next) => {
    
    return res.status(200)
    .render("pages/allUsers.ejs",{
        res: res.queryResults,
        user: req.user,
        access_token: req.cookies.access_token,
        flashAlert: req.flash()
      });
    // .json(res.queryResults);
});


module.exports = {
    getSingleUser,
    getAllUsers
}