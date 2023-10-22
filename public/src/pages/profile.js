const loadMoreQuestions = document.querySelector("#profile-questions .load-more");
const loadMoreAnswers = document.querySelector("#profile-answers .load-more");
const confirmElements = document.querySelectorAll(".confirm");

const questions = loadMoreData.questions;
const answers = loadMoreData.answers;



for (let i = 0; i < confirmElements.length; i++) {
    confirmElements[i].addEventListener("click",confirmIt);
}
function confirmIt(e) {
    if (!confirm("Are You Sure to Delete?")) e.preventDefault();
}

if (questions.count > questions.leng) {
    const href = updateURLParameter(url,"questions",questions.leng + 5);
    loadMoreQuestions.setAttribute("href",href);
} else loadMoreQuestions.setAttribute("style","display: none;");

if (answers.count > answers.leng) {
    const href = updateURLParameter(url,"answers",answers.leng + 5);
    loadMoreAnswers.setAttribute("href",href);
} else loadMoreAnswers.setAttribute("style","display: none;");