const sortButtons = document.getElementById("sort-button-group");
const questionsTitle = document.querySelector("#box-1-q h1");
const askButton = document.querySelector("#box-1-q .ask");


function eventListeners() {
    sortButtons.addEventListener("click",(e) => {
        sort = e.target.getAttribute("label");
        let newUrl = updateURLParameter(url.replace("#",""),"sortBy",sort);
        newUrl = updateURLParameter(newUrl.replace("#",""),"page",1);
        window.location.href = newUrl;
        e.preventDefault();
    });
    // askButton.addEventListener("click",() => {
    //     const token = document.cookie.split("=")[1];
    //     if (token) {
    //         window.location = "http://localhost:5000/api/questions/ask";
    //     } else {
    //         showAlert("You are not authorized to access this route");
    //     }
    // });
}
eventListeners();


// Tags Href
tagsHref();

// Active Sort Button Selector
[...sortButtons.children].forEach(element => {
    if (element.getAttribute("label") === options.sortBy) {
        element.classList.add("active");
    }
});
// Search Title
if ((options.search && options.search != "") && (options.tags && options.tags != "")) {
    const search = decodeURI(options.search);
    let decodedTags = decodeURI(options.tags);
    decodedTags = decodedTags.replace(/ /g, ", ");
    questionsTitle.textContent = `Filtered by "${decodedTags}" tags & search result for "${search}"`;
} else if (options.search && options.search != "") {
    const search = decodeURI(options.search);
    questionsTitle.textContent = `Search results for "${search}"`;
} else if (options.tags && options.tags != "") {
    let decodedTags = decodeURI(options.tags);
    decodedTags = decodedTags.replace(/ /g, ", ");
    questionsTitle.textContent = `Filtered by "${decodedTags}" Tags`
}