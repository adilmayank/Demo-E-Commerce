const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const CustomError = require("../errors");
const bcrypt = require("bcryptjs");
const {createTokenUser, attachCookiesToResponse, checkPermissions} = require("../utils/index");

const getAllUser = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role:"User"}).select("-password");

    res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async (req, res) => {
    console.log(req.user);
    const user = await User.findOne({_id: req.params.id}).select("-password");
    if(!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user: user});
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
}

// update user with user.save()
const updateUser = async (req, res) => {
    const {name, email} = req.body;
    
    if(!name || !email) {
        throw new CustomError.BadRequestError("Please provide name and email...");
    };

    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});
}

// update user with findoneandupdate
// const updateUser = async (req, res) => {
//     const {name, email} = req.body;

//     if(!name || !email) {
//         throw new CustomError.BadRequestError("Please provide name and email...");
//     };
//     const user = await User.findOneAndUpdate({_id: req.user.userId}, {email, name}, {new: true, runValidators: true});
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res, user: tokenUser});
// }

const updateUserPassword = async (req, res) => {
    const oldPassword = req.body.oldPassword.trim();
    const newPassword = req.body.newPassword.trim();

    if(oldPassword.length === 0 || newPassword.length === 0) {
        throw new CustomError.BadRequestError("Old and new password must be provided.")
    }

    const user = await User.findOne({_id: req.user.userId});
    const oldPasswordMatches = await user.comparePassword(oldPassword);
    if(!oldPasswordMatches) {
        throw new CustomError.UnauthenticatedError("Incorrect password. Please try again.");
    }

    user.password = newPassword

    await user.save();

    res.status(StatusCodes.OK).json({msg: "Password updated"});

}

module.exports = {
    getAllUser,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}