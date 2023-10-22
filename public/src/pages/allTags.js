const tagsTitle = document.querySelector("#box-1-t h1");

if (options.search && options.search != "") {
    const search = decodeURI(options.search);
    tagsTitle.textContent = `Search Results for ${search}`;
}

// Tags Href
tagsHref();