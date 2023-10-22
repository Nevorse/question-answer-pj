const asyncErrorWrapper = require("express-async-handler");
const {
    answerSelectHelper,
    populateHelper,
    answerSortHelper,
    paginationHelper,
    getDateDiff
} = require("./queryMiddlewareHelpers");

const answerQueryMiddleware = function(model, options) {

    return asyncErrorWrapper(async function(req, res, next) {
        const { question_id } = req.params;
        
        const total = await model.countDocuments({question: question_id});
        let query = model.find({question: question_id});

        // Select
        query = answerSelectHelper(query);
        // Populate
        if (options && options.population) {
            query = populateHelper(query, options.population);
        }
        // Sort
        query = answerSortHelper(query);
        // Pagination
        paginationResults = await paginationHelper(total, query, req);

        query = paginationResults.query;
        const pagination = paginationResults.pagination;
        const pageCount = paginationResults.pageCount;
        
        const queryResults = await query;

        for (let i = 0; i < queryResults.length; i++) {
            const dateDiff = getDateDiff(queryResults[i].createdAt);
            queryResults[i]._doc.dateDiff = dateDiff;
        }

        res.queryResults = {
            success: true,
            count: total,
            pageCount: pageCount,
            pagination: pagination,
            data: queryResults
        }
        next();
    });
};

module.exports = answerQueryMiddleware;