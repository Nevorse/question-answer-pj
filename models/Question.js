const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const QuestionSchema = new Schema({
    title: {
        type: String,
        require: [true, "Please provide a title"],
        minlength: [10, "Please provide a title at least 10 characters"],
        unique: true,
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [20, "Please provide a content at least 20 characters"],
    },
    slug: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
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
    answerCount: {
        type: Number,
        default: 0
    },
    answers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Answer"
        }
    ],
    tags: {
        type: [{
            type: String
        }],
        validate: [tagLimit, 'You can add up to 5 {PATH}']
    }
});
QuestionSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
    });
};
QuestionSchema.pre("save", function (next) {
   if (!this.isModified("title")) {
      next();
   }
   this.slug = this.makeSlug();
   next();
});
function tagLimit(val) {
    return val.length <= 5;
}

module.exports = mongoose.model("Question", QuestionSchema);
