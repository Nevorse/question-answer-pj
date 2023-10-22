const addAnswerBox = document.querySelector("#answer-textarea");


// Tags Href
tagsHref();

if (flashAlert.addAnswerData) {
    addAnswerBox.value = flashAlert.addAnswerData[0].content;
}

// Answer hash
const answerIndex = window.location.hash.split("-")[1];
const answerPage = Math.ceil((answerCount - answerIndex) / options.limit);

if (window.location.hash.split("-")[0] == "#answer" && answerPage > 1) {
    const url = window.location.origin + window.location.pathname + window.location.search;
    window.location.href = updateURLParameter(url,"page",answerPage)+window.location.hash;
} else if (window.location.hash.split("-")[0] == "#answer" && options.page != answerPage) {
    const url = window.location.origin + window.location.pathname + window.location.search;
    window.location.href = updateURLParameter(url,"page",answerPage)+window.location.hash;
}