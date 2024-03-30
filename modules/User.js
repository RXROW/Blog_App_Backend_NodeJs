const mongoose = require("mongoose");
//const jwt = require('jsonwebtoken');
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const passwordComplexity = require("joi-password-complexity");

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null,
        },
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// populate posts that belonge to users
UserSchema.virtual("posts",{
  ref:"Post",
  foreignField:"user",
  localField:"_id",
})


// Generate Auth Token
UserSchema.methods.generateWebToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY);
};

// User Model
const User = mongoose.model("User", UserSchema);
// Validated Login User
function validatedLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}


// Validated Register User
function validatedRegisterUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(80).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}


// Validated Update User
function validatedUpdateUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100) ,
        password: Joi.string().trim().min(8) ,
        bio: Joi.string()
    });
    return schema.validate(obj);
}


module.exports = {
    User,
    validatedRegisterUser,
    validatedLoginUser,
    validatedUpdateUser
};
