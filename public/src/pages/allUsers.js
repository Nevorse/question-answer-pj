const usersTitle = document.querySelector("#box-1-u h1");

if (options.search && options.search != "") {
    const search = decodeURI(options.search);
    usersTitle.textContent = `Search Results for ${search}`;
}