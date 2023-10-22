const asyncErrorWrapper = require("express-async-handler");
const {
    populateHelper,
    paginationHelper,
    answerSelectHelper
} = require("./queryMiddlewareHelpers");

const singleQuestionQueryMiddleware = function(model, options) {
   
    return asyncErrorWrapper(async function(req, res, next) {
        const { id } = req.params;

        const arrayName = "answers";
        
        const total = (await model.findById(id))["answerCount"];

        const paginationResult = await paginationHelper(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;
        const pageCount = paginationResult.pageCount;

        let queryObject = {};
        queryObject[arrayName] = {$slice : [startIndex,limit]};

        let query = model.find({_id : id},queryObject);

        query = answerSelectHelper(query);
        query = populateHelper(query,options.population);


        const queryResults = await query;

        res.queryResults = {
            success: true,
            pageCount: pageCount,
            pagination: paginationResult.pagination,
            data: queryResults
        };
    next();
   });
};

module.exports = singleQuestionQueryMiddleware;