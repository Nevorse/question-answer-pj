const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("./Question");

const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10, "Please provide a content at least 10 characters"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    index: {
        type: Number
    },
    voteCount : {
        type: Number,
        default: 0
    },
    votes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    unVotes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
        required: true,
    }
});
AnswerSchema.pre("save",async function(next) {
    if (!this.isModified("user")) return next();

    try {
        const question = await Question.findById(this.question);

        this.index = question.answerCount;
        
        question.answers.push(this._id);
        question.answerCount = question.answers.length;

        await question.save();
        next();
    }
    catch (err) {
        return next(err);
    }
});


module.exports = mongoose.model("Answer", AnswerSchema);