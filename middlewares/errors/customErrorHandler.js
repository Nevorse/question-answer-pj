const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next) => {
    let customError = err;

    if (err.name === "SyntaxError") {
        customError = new CustomError("Unexpedted Syntax", 400);
    }
    if (err.name === "ValidationError") {
        customError = new CustomError(err.message, 400);
        if (err.errors.title) customError = new CustomError(err.errors.title.message, 400);
        else if (err.errors.content) customError = new CustomError(err.errors.content.message, 400);
        else if (err.errors.tags) customError = new CustomError(err.errors.tags.message, 400);
    }
    if (err.name === "MongoServerError" && err.code === 11000) {
        customError = new CustomError("Duplicate Key Found : Check Your Input", 400);
    }
    if (err.name === "CastError") {
        customError = new CustomError("Please provide a valid id", 400);
    }

    /*--- Flash control ---*/
    let status;
    if (customError.status) status = customError.status.toString();

    if (status && status.substr(0,4) == 4001) {
        if (status.substr(4,1) == 1) req.flash("signFormError",[customError.message,"1"]);
        else if (status.substr(4,1) == 2) req.flash("signFormError",[customError.message,"2"]);
        else if (status.substr(4,1) == 3) req.flash("signFormError",[customError.message,"3"]);
    }

    else req.flash("error",customError.message);

    /*--- redirect ---*/
    if (status && status.substr(2,1) == 1) {
        if (status.substr(3,1) == 1) return res.status(customError.status || 500).redirect("back");
        return res.status(customError.status || 500).redirect("/api/questions");
    }
    
    res.status(customError.status || 500)
    .redirect("back");
    // .json({
    //     success: false,
    //     message: customError.message
    // });
};

module.exports = customErrorHandler;