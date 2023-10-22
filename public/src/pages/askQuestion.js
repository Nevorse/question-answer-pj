const titleInput = document.getElementById("ask-question-title");
const contentInput = document.getElementById("ask-question-content");
const tagInput = document.getElementById("ask-question-tags");
const tagInputBox = document.getElementById("tag-input-box");
const tagList = document.querySelector("#question-tags ul");
const askQuestionButton = document.querySelector("#ask-question .ask");

let addTagsArr = [];

askQuestionTagsEvents(tagInput);



/*--- Error Restore Values ---*/
if (flashAlert.askQuestionData) {
    const data = flashAlert.askQuestionData[0]
    console.log(data);
    titleInput.value = data.title;
    contentInput.value = data.content;
    addTagsArr = data.tags;
    renderTagsInputHelper(addTagsArr);
}


function askQuestionTagsEvents(element) {
    tagInputBox.addEventListener("click",() => {
        element.focus();
    });
    element.addEventListener("blur", (e) => {
        if (!element.value.match(/^\s+$/gi) && element.value !== "") {
            if (addTagsArr.includes(element.value.trim())) { e.target.value = ""; }
            else {
                addTagsArr.push(e.target.value.trim());
                element.value = "";
                renderTagsInputHelper(addTagsArr);
            }
        }
    });
    element.addEventListener("keydown",(e) => {
        let value = e.target.value;

        if ((e.keyCode === 32 || e.keyCode === 13 || value[value.length - 1] === " ")
           && 
           (!value.match(/^\s+$/gi) && value !== ""))
        {
            if (addTagsArr.includes(value.trim())) { e.target.value = ""; }
            else {
                addTagsArr.push(e.target.value.trim());
                element.value = "";
                renderTagsInputHelper(addTagsArr);
            }
        }
        if (e.keyCode === 8 && value === "") {
            addTagsArr.pop();
            renderTagsInputHelper(addTagsArr);
        }
    });
}
function renderTagsInputHelper(tagsArr) {
    tagList.innerHTML = "";
    
    if (tagsArr) {
        tagsArr.forEach(e => {
            const tag = addTagHelper(e,"btn btn-secondary qtag");
            tag.addEventListener("click",() => {
                addTagsArr = addTagsArr.filter((t) => t != e);
                renderTagsInputHelper(addTagsArr);
            });
            tagList.appendChild(tag);
        });
    }
    const input = document.createElement("input");
    input.setAttribute("onkeydown","return event.key != 'Enter';")
    input.id = "ask-question-tags";
    input.type = "text";
    askQuestionTagsEvents(input);
    tagList.appendChild(input);
    input.focus();
    setTimeout(() => (input.value = ""), 0);
}

function addTagHelper (tagName, btnClass) {
    const tag = document.createElement("input");
    tag.setAttribute("type","text");
    tag.name = "tags[]"
    tag.value = tagName;
    tag.className = btnClass;
    tag.style.width = tagName.length + 4 + "ch";
    return tag;
};