const express = require("express");
const router = express.Router({ mergeParams: true });
const Answer = require("../models/Answer");
const {
    getAccessToRoute,
    getAnswerOwnerAccess,
    getAccessToRouteRedirectBack
} = require("../middlewares/authorization/authorization");
const {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    voteAnswer,
    unVoteAnswer
} = require("../controllers/answerCtrl");
const {
    checkQuestionAndAnswerExist,
} = require("../middlewares/database/databaseErrorHelpers");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");


router.post("/", getAccessToRoute, addNewAnswerToQuestion);

router.get("/"
,answerQueryMiddleware(Answer,{population : {path: "user", select: "name profile_image role"}})
,getAllAnswersByQuestion);

// router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer);

router.get("/:answer_id/vote",[getAccessToRouteRedirectBack, checkQuestionAndAnswerExist], voteAnswer);
router.get("/:answer_id/undo_vote",[getAccessToRouteRedirectBack, checkQuestionAndAnswerExist], unVoteAnswer);

// router.put(
//     "/answers/:answer_id/edit",
//     [checkQuestionAndAnswerExist, getAccessToRouteRedirectBack, getAnswerOwnerAccess],
//     editAnswer
// );  

// delete in question.js

module.exports = router;
