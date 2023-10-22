const url = window.location.origin + window.location.pathname + window.location.search;

const optionsArr = location.search.replace("?","").split("&");
const searchForm = document.getElementById("searchInput");
const searchInput = document.querySelector("#searchInput input");

const singIn = document.getElementById("signin")
const signUp = document.getElementById("signup");
const profileCard = document.getElementById("profile-card");
const logout = document.getElementById("logout");

const options = getOptions(optionsArr);


function eventListeners() {
    searchForm.addEventListener("submit",(e) => {
        const search = searchInput.value;
        const newUrl = updateURLParameter(url,"search",search);
        window.location.href = newUrl;
        e.preventDefault();
    });
}
eventListeners();


/*--------- Global Functions ---------*/

function getOptions(array) {
    let op = {page: 1, limit: 5, sortBy: "newest"}
    array.forEach(element => {
        if (element) {
            const key = element.split("=")[0];
            const value = Number(element.split("=")[1].replace("#","")) 
            || element.split("=")[1].replace("#","");
            op[key] = value;
    }});
    return op;
}

function updateURLParameter(url, param, paramVal){
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (let i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    let rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function showAlert(message, type) {
    const alertList = document.querySelector("#page-alert-list");
    const alert = document.createElement("div");
    const p = document.createElement("p");

    alertList.appendChild(alert);
    alert.appendChild(p);
    alert.id = "page-alert";
    alert.className = type;
    alert.style.maxWidth = 0;
    p.textContent = message;
    setTimeout(() => alert.style.maxWidth = "800px", 50);
    setTimeout(() => alert.style.maxWidth = 0, 5000);
    setTimeout(() => alert.remove(), 10000);
}
function tagsHref() {
    // Extract search from window.location.search
    let searchArr = window.location.search.split("&");
    searchArr.forEach(element => {
        if (element.includes("search=")) {            
            const index = searchArr.indexOf(element);
            searchArr.splice(index,1);
        }
    });
    const searchString = searchArr.toString().replace(",","&").replace("?","");
    
    // Set href's
    const url = window.location.origin + "/api/questions?" + searchString;

    const tags = document.querySelectorAll(".qtag");
    for (let i = 0; i < tags.length; i++) {
        const tagName = tags[i].textContent;
        const encodedTag = encodeURI(tagName);
        let href;

        if (options.tags && !options.tags.includes(encodedTag)) {
            href = updateURLParameter(url, "page", 1);
            href = updateURLParameter(href, "tags", options.tags + "%20" + tagName);
        } else if (!options.tags || options.tags == "") {
            href = updateURLParameter(url, "page", 1);
            href = updateURLParameter(href, "tags", tagName);
        } else href = updateURLParameter(url, "page", 1);

        tags[i].setAttribute("href",href);
    }
}