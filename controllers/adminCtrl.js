const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const blockUser = asyncErrorWrapper(async(req, res, next) => {
    const {id} = req.params;
    const user = req.data;

    user.blocked = !user.blocked;

    await user.save();
    return res.status(200).json({
        success: true,
        message: "Block Unblock Successful"
    });
});
const deleteUser = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
    // const user = req.data;1
    const user = await User.findById(id);
    
    await user.deleteOne();

    return res.status(200)
    .json({
        success: true,
        message: "Delete Operation Successfull" 
    });
});


module.exports = {
    blockUser,
    deleteUser
}
