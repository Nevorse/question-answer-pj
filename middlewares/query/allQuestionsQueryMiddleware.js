const asyncErrorWrapper = require("express-async-handler");
const {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper,
    questionSelectHelper,
    getDateDiff
} = require("./queryMiddlewareHelpers");

const allQuestionsQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        // Initial Query
        let query = model.find();
        let count = model.countDocuments();
        // Tags
        if (req.query.tags) {
            const tags = req.query.tags.split(" ");
            query = model.find({tags: {$all: tags}});
            count = model.countDocuments({tags: {$all: tags}});
            res.tags = tags;
        }
        // Search
        query = searchHelper("title", query, req);
        count = searchHelper("title", count, req);
        // Select
        query = questionSelectHelper(query);
        // Populate
        if (options && options.population) {
            query = populateHelper(query, options.population);
        }
        query = questionSortHelper(query, req);
        // Pagination
        const total = await count;

        const paginationResult = await paginationHelper(total, query, req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const pageCount = paginationResult.pageCount;
        const queryResults = await query;

        // Date Diff
        for (let i = 0; i < queryResults.length; i++) {
            const dateDiff = getDateDiff(queryResults[i].createdAt);
            queryResults[i]._doc.dateDiff = dateDiff;
        }

        
        res.queryResults = {
            success: true,
            count: total,
            pageCount: pageCount,
            pagination: pagination,
            data: queryResults,
        };
        next();
    });
};

module.exports = allQuestionsQueryMiddleware;
