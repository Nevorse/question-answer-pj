const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {
        const searchObject = {};
        const regex = new RegExp(req.query.search, "i");
        searchObject[searchKey] = regex;

        return query.where(searchObject);
    }
    return query;
};
const questionSelectHelper = (query) => {
    return query.select("-answers -votes -unVotes");
};
const answerSelectHelper = (query) => {
    return query.select("-votes -unVotes");
};
const allUsersSelectHelper = (query) => {
    return query.select("-email -blocked")
}
const populateHelper = (query, population) => {
    return query.populate(population);
};
const questionSortHelper = (query, req) => {
    const sortKey = req.query.sortBy;
    if (sortKey === "most-answered") {
        return query.sort("-answerCount -createdAt");
    }
    if (sortKey === "most-liked") {
        return query.sort("-voteCount -createdAt");
    }
    return query.sort("-createdAt");
}
const answerSortHelper = (query) => {
    return query.sort("-voteCount -createdAt");
}
const paginationHelper = (totalDocument,query,req) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {currentPage: {
        page: page,
        limit: limit
    }};
    
    const total = totalDocument;
    const pageCount = Math.ceil(total / limit);

    if (startIndex > 0) {
        pagination.previous = {
            page : page - 1,
            limit : limit,
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page : page + 1,
            limit : limit,
        }

    }
    return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination : pagination,
        startIndex,
        limit,
        pageCount
    };
};
const getDateDiff = (date) => {
    const date1 = new Date(date);
    const date2 = Date.now();
    const diffTime = Math.abs(date2 - date1);
    const diffMins = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
        return diffMins + " mins";
    }
    if (diffHours < 24) {
        return diffHours + " hours";
    }
    return diffDays + " days";
};


module.exports = {
    searchHelper,
    questionSelectHelper,
    answerSelectHelper,
    populateHelper,
    questionSortHelper,
    answerSortHelper,
    paginationHelper,
    allUsersSelectHelper,
    getDateDiff
};
