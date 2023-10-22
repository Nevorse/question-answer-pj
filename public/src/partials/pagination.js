const pageList = document.getElementById("page-list");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageSizer = document.getElementById("page-size");
const sizerFloat = document.querySelector("#box-4 .sizer-float");


// Controls
if (window.location.pathname === "/api/questions/tags" 
    || window.location.pathname === "/api/users") {
    sizerFloat.style.display = "none";
}
if (res.success === true && res.count === 0) {
    sizerFloat.style.display = "none";
}


// Events
function eventListeners() {
    prevButton.addEventListener("click",() => {
        if (options.page > 1) {
            options.page -= 1
            window.location.href = updateURLParameter(url,"page", options.page);
        }
    });
    nextButton.addEventListener("click",() => {
        if (options.page < res.pageCount) {
            options.page += 1
            window.location.href = updateURLParameter(url,"page", options.page);
        }
    });
    pageSizer.addEventListener("click",(e) => {
        options.limit = e.target.getAttribute("page-size");
        window.location.href = updateURLParameter(url, "limit", options.limit);
    });
}
eventListeners();

// Sizer active button selector
[...pageSizer.children].forEach(element => {
    if (element.getAttribute("page-size") == options.limit)
    { element.classList.add("active") }
});
if (!(options.page === 1) && res.data.length === 0) {
    options.page = res.pageCount;
    window.location.href = updateURLParameter(url, "page", options.page);
}

// Add Page
const paginationArray = getPaginationArrayHelper(res.pageCount, options.page);
paginationArray.forEach(index => {
    if (index === "...") {
        const separator = document.createElement("div");
        separator.className = "separator";
        separator.innerHTML = index;
        pageList.appendChild(separator)
    } else {
        const href = updateURLParameter(url,"page",index);
        const pageButton = document.createElement("a");
        if (index === options.page) 
        {pageButton.className = "btn btn-outline page active";}
        else {pageButton.className = "btn btn-outline page";}
        pageButton.innerHTML = index;
        pageButton.setAttribute("page-index", index);
        pageButton.setAttribute("aria-label", "Page " + index);
        pageButton.setAttribute("href", href);
        pageList.appendChild(pageButton);
    }
});

/*--------- Functions ---------*/
function getPaginationArrayHelper (pc, p) {
    const pageCount = Number(pc);
    const page = Number(p);
    let arr = [];

    if (pageCount <= 5) {
        for (let i = 1; i <= pageCount; i++) {
            arr.push(i);
        }
    } else {
        if (page <= 4) {
            for (let i = 1; i <= 5; i++) {
                arr.push(i);
            }
            arr.push("...");
            arr.push(pageCount);
        } else {
            if (page > pageCount - 4) {
                for (let i = pageCount; i > pageCount - 5; i--) {
                    arr.unshift(i);
                }
                arr.unshift("...");
                arr.unshift(1);
            } else {
                arr.unshift("...");
                arr.unshift(1);

                for (let i = page - 2; i <= pageCount && i <= page + 2; i++) {
                    arr.push(i);
                }

                arr.push("...");
                arr.push(pageCount);
            }
        }
    }
    return arr;
};