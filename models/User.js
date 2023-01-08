const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email.",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['Admin', "User"],
        default: "User",
    }
});


UserSchema.pre("save", async function() {

    const isPasswordModified = this.isModified("password");
    if(!isPasswordModified) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

UserSchema.methods.comparePassword = async function(candidatePassword) { 
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}


module.exports = mongoose.model("User", UserSchema);