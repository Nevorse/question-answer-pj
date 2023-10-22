const asyncErrorWrapper = require("express-async-handler");
const {
    searchHelper,
    paginationHelper,
    allUsersSelectHelper,
    getDateDiff
} = require("./queryMiddlewareHelpers");

const allUsersQueryMiddleware = function(model, options) {
    return asyncErrorWrapper(async function(req,res,next) {
        let query = model.find();
        let count = model.countDocuments();
        
        query = searchHelper("name", query, req);
        count = searchHelper("name", count, req);

        query = allUsersSelectHelper(query);

        req.query.limit = 20;

        const total = await count;
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;
        const pageCount = paginationResult.pageCount;

        const queryResults = await query.sort("role createdAt");

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
    })
};

module.exports = allUsersQueryMiddleware;