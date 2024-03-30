const mongoose = require("mongoose");
const Joi = require("joi");

// Comment Schema
const CommentSchema = new mongoose.Schema({
 postId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Post",
  required:true,

 },
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true,

 },
 text:{
  type:String,
  requireed:true,
 },
 username:{
  type:String,
  requireed:true,
 
 },
},{timestamps:true});

// Comment Modul
const Comment = mongoose.model("Comment",  CommentSchema);

// Vildtat Create Comment 
function validateCreateComment(obj) {
  const schema= Joi.object({
    postId:Joi.string().trim().required().label("Post ID"),
    text:Joi.string().trim().required(),
 
  })
  return schema.validate(obj);
  
}
// Vildtat Updata Comment 
function validateUpdataComment(obj) {
  const schema= Joi.object({
    text:Joi.string().trim().required(),
 
  })
  return schema.validate(obj);
  
}


module.exports={
  Comment,
  validateCreateComment,
  validateUpdataComment,

}