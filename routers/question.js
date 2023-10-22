const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const answer = require("./answer");

const {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    voteQuestion,
    unVoteQuestion,
    getAllTags,
    askNewQuestionPage
} = require("../controllers/questionCtrl");
const {
    getAccessToRoute,
    getQuestionOwnerAccess,
    getUserIfToken,
    getAccessToRouteRedirectBack,
    getAnswerOwnerAccess
} = require("../middlewares/authorization/authorization");
const {
    checkQuestionExist, checkAnswerExist,
} = require("../middlewares/database/databaseErrorHelpers");
const allQuestionsQueryMiddleware = require("../middlewares/query/allQuestionsQueryMiddleware");
const singleQuestionQueryMiddleware = require("../middlewares/query/singleQuestionQueryMiddleware");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");
const { editAnswer, deleteAnswer } = require("../controllers/answerCtrl");


router.get("/",allQuestionsQueryMiddleware(Question, {
        population:{
            path: "user",
            select: "name profile_image role",
        }
    }),
    getUserIfToken,
    getAllQuestions
);
router.get("/ask", getAccessToRouteRedirectBack, askNewQuestionPage);
router.post("/ask", getAccessToRoute, askNewQuestion);

router.get("/tags", getUserIfToken, getAllTags);

router.get("/:question_id", checkQuestionExist
,getUserIfToken
,answerQueryMiddleware(Answer,{population : {path: "user", select: "name profile_image role"}})
,getSingleQuestion);

// router.put(
//     "/:id/edit",
//     [getAccessToRouteRedirectBack, checkQuestionExist, getQuestionOwnerAccess],
//     editQuestion
// );
router.get(
    "/:id/delete",
    [getAccessToRouteRedirectBack, checkQuestionExist, getQuestionOwnerAccess],
    deleteQuestion
);
router.get("/:id/vote", [getAccessToRouteRedirectBack, checkQuestionExist], voteQuestion);
router.get("/:id/undo_vote",[getAccessToRouteRedirectBack, checkQuestionExist],unVoteQuestion);



// Answers
router.get(
    "/answers/:answer_id/delete",
    [checkAnswerExist, getAccessToRouteRedirectBack, getAnswerOwnerAccess],
    deleteAnswer
);
router.use("/:question_id/answers", checkQuestionExist, answer);


module.exports = router;