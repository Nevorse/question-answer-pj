const Question = require("../../models/Question");
const Answer = require("../../models/Answer");


const singleUserQueryMiddleware = function (options) {
    return asyncErrorWrapper(async function (req, res, next) {

        let questionQuery = Question.find({user: req.data._id});
        let answerQuery = Answer.find({user: req.data._id});

        
    });
}