const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("../middlewares/query/queryMiddlewareHelpers");
const Answer = require("../models/Answer");


const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;
  
  if (information.tags && !Array.isArray(information.tags)) {
    const tags = information.tags.split(" ");
    information.tags = tags;
  }

  try {
    await Question.create({
      ...information,
      user: req.user.id,
    });
  } catch(err) {
    req.flash("askQuestionData",information);
    return next(err);
  }
  req.flash("success","Question added");
  return res.status(200)
  .redirect("/api/questions");
  // .json({
  //   success: true,
  //   data: question,
  // });
});
const askNewQuestionPage = asyncErrorWrapper(async(req, res, next) => {
  
  return res.status(200)
  .render("pages/askQuestion.ejs", {
    res: {},
    user: req.user,
    access_token: req.cookies.access_token,
    flashAlert: req.flash()
  });
});
const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

  return res.status(200)
  .render("pages/allQuestions.ejs",{
    res: res.queryResults,
    user: req.user,
    access_token: req.cookies.access_token,
    flashAlert: req.flash()
  });
  // .json(res.queryResults);
});
const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {

  res.status(200)
  .render("pages/singleQuestion.ejs", {
    res: res.queryResults,
    question_data: req.data,
    user: req.user,
    access_token: req.cookies.access_token,
    flashAlert: req.flash()
  })
  // .json(res.queryResults);
});
const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  let question = req.data;

  question.title = title;
  question.content = content;

  question = await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});
const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const answers = await Answer.find({question: id});

  answers.forEach(async (element) => {
    await Answer.findByIdAndRemove(element._id);
  });


  await Question.findByIdAndDelete(id);

  req.flash("success","Question delete successfully");
  return res.status(200)
  .redirect("back");
  // .json({
  //   success: true,
  //   message: "Question delete operation successful",
  // });
});
const voteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const question = req.data;

  if (question.votes.includes(req.user.id)) {
    return next(new CustomError("You already liked this question", 400));
  }
  if (question.unVotes.includes(req.user.id)) {
    const index = question.unVotes.indexOf(req.user.id);
    question.unVotes.splice(index, 1);
    question.voteCount = question.voteCount + 1;
  }
  question.votes.push(req.user.id);
  question.voteCount = question.voteCount + 1;

  await question.save();

  req.flash("success","Voted successfully");
  res.status(200)
  .redirect("back");
  // .json({
  //   success: true,
  //   data: {voteCount: question.voteCount}
  // });
});
const unVoteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const question = req.data;

  if (question.unVotes.includes(req.user.id)) {
    return next(
      new CustomError("You already unliked this question", 400)
    );
  }
  if (question.votes.includes(req.user.id)) {
    const index = question.votes.indexOf(req.user.id);
    question.votes.splice(index, 1);
    question.voteCount = question.voteCount - 1;
  }
  question.unVotes.push(req.user.id);
  question.voteCount = question.voteCount - 1;

  await question.save();

  req.flash("success","Downvoted successfully");
  res.status(200)
  .redirect("back");
  // .json({
  //   success: true,
  //   data: {voteCount: question.voteCount}
  // });
});
// const getQuestionsByTags = asyncErrorWrapper(async (req, res, next) => {
//     return res.status(200).json(res.queryResults);
// });
const getAllTags = asyncErrorWrapper(async (req, res, next) => {
  const allDoc = await Question.find().select("tags -_id");
  let allTags = [];
  allDoc.forEach(a => {
    a.tags.forEach(e => {
      if (!allTags.includes(e)) {
        allTags.push(e);
      }
    });
  });
// Search
  function search(array, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    var indices = [];
    for (var i = 0; i < array.length; i++) {
        var currentItem = array[i].toLowerCase();
        if (currentItem.indexOf(searchTerm) !== -1) {
            indices.push(array[i]);
        }
    }
    return indices;
  }
  let tags;
  if (req.query.search) tags = search(allTags, req.query.search);
  else tags = allTags;
  
// Pagination
  const limit = 24;
  req.query.limit = 24;

  const total = tags.length;
  const paginationResults = await paginationHelper(total, undefined, req);
  const pageCount = paginationResults.pageCount;
  const startIndex = paginationResults.startIndex;
  const pagination = paginationResults.pagination;

  const data = tags.slice(startIndex,(startIndex+limit));

  const response = {
    success: true,
    count: total,
    pageCount: pageCount,
    pagination: pagination,
    data: data,
  }

  res.status(200)
  .render("pages/allTags.ejs",{
    res: response,
    user: req.user,
    access_token: req.cookies.access_token,
    flashAlert: req.flash()
  });
  // .json({
  //   success: true,
  //   count: total,
  //   pageCount: pageCount,
  //   pagination: pagination,
  //   data: data,
  // });
});



module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  voteQuestion,
  unVoteQuestion,
  // getQuestionsByTags,
  getAllTags,
  askNewQuestionPage
};
