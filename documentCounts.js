const Question = require("./models/Question");
const Answer = require("./models/Answer");

const documentCounts = async () => {
    const questions = await Question.find();
    const answers = await Answer.find();

    let q = 0;
    while (q < questions.length) {
        question = questions[q];
        question.voteCount = question.votes.length - question.unVotes.length;
        question.answerCount = question.answers.length;

        await question.save();
        q++;
    }
    console.log("Questions Votes Count Set");

    let a = 0;
    while(a < answers.length) {
        answer = answers[a];
        answer.voteCount = answer.votes.length - answer.unVotes.length;

        await answer.save();
        a++;
    }
    console.log("Answers Votes Count Set");
}



module.exports = {documentCounts};