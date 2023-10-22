const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper(async(req,res,next) => {
    const {question_id} = req.params;
    const user_id = req.user.id;
    const information = req.body;

    try {
        await Answer.create({
            ...information,
            question : question_id,
            user: user_id
        });
    } catch(err) {
        req.flash("addAnswerData",information);
        return next(err);
    }
    req.flash("success","Answer added");
    return res.status(200)
    .redirect("back");
    // .json({
    //     success: true,
    //     data: answer
    // });
});
const getAllAnswersByQuestion = asyncErrorWrapper(async(req,res,next) => {
    // const {question_id} = req.params;

    // const answers = await Answer.find({question: question_id})
    // .populate({
    //     path: "user",
    //     select: "name profile_image role"
    // });

    // return res.status(200).json({
    //     success: true,
    //     count : answers.length,
    //     data : answers
    // });

    res.status(200).json(res.queryResults);

});
const getSingleAnswer = asyncErrorWrapper(async(req,res,next) => {
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id)
    .populate({
        path: "question",
        select: "title"
    })
    .populate({
        path: "user",
        select: "name profile_image role"
    });

    res.status(200).json({
        success: true,
        data: answer
    });
});
const editAnswer = asyncErrorWrapper(async(req,res,next) => {
    const {content} = req.body;
    
    // const {answer_id} = req.params;
    // let answer = await Answer.findById(answer_id);
    let answer = req.data;

    answer.content = content;
    await answer.save();

    return res.status(200).json({
        success: true,
        data: answer
    });
});
const deleteAnswer = asyncErrorWrapper(async(req,res,next) => { 
    const { answer_id } = req.params;
    const question_id = String(req.data.question);

    await Answer.findByIdAndRemove(answer_id);
    
    const question = await Question.findById({_id: question_id});

    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answerCount = question.answers.length;

    await question.save();

    req.flash("success","Answer delete successfully");
    return res.status(200)
    .redirect("back");
    // .json({
    //     success: true,
    //     message: "Answer deleted succesfully"
    // });
});
const voteAnswer = asyncErrorWrapper(async(req,res,next) => {
    const answer = req.data;

    if (answer.votes.includes(req.user.id)) {
        return next(new CustomError("You already liked this answer",400));
    }
    if (answer.unVotes.includes(req.user.id)) {
        const index = answer.unVotes.indexOf(req.user.id);
        answer.unVotes.splice(index,1);
        answer.voteCount = answer.voteCount + 1
    }
    answer.votes.push(req.user.id);
    answer.voteCount = answer.voteCount + 1;

    await answer.save();

    req.flash("success","Voted successfully");
    res.status(200)
    .redirect("back");
    // .json({
    //     success: true,
    //     data: {voteCount: answer.voteCount}
    // });
});
const unVoteAnswer = asyncErrorWrapper(async(req,res,next) => {
    const answer = req.data;

    if (answer.unVotes.includes(req.user.id)) {
        return next(new CustomError("You already unliked this answer",400));
    }
    if (answer.votes.includes(req.user.id)) {
        const index = answer.votes.indexOf(req.user.id);
        answer.votes.splice(index,1);
        answer.voteCount = answer.voteCount - 1;
    }
    answer.unVotes.push(req.user.id);
    answer.voteCount = answer.voteCount - 1;

    await answer.save();

    req.flash("success","Downvoted successfully");
    res.status(200)
    .redirect("back");
    // .json({
    //     success: true,
    //     data: {voteCount: answer.voteCount}
    // });
});


module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    voteAnswer,
    unVoteAnswer
}