const mongoose = require("mongoose");
const Joi = require("joi");

// Post Schema
const PostSchema = new mongoose.Schema({
  title:{
    type:String,
    requireed:true,
    trim:true,
    minlength:2,
    maxlength:200,
  },
  description:{
    type:String,
    requireed:true,
    trim:true,
    minlength:10,
   },
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    requireed:true,
   
  },
  category:{
    type:String,
    requireed:true,
   
  },
  image:{
    type:Object,
    default:{
      url:"",
      publicId:null,
    },

 
  },    
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",

    }
  ]



},{
  timestamps: true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
);
// populate comment that belonge to posts
PostSchema.virtual("comments",{
  ref:"Comment",
  foreignField:"postId",
  localField:"_id",
})

// Post Modul
const Post = mongoose.model("Post", PostSchema);

// Vildtat Create Post 
function validateCreatePost(obj) {
  const schema= Joi.object({
    title:Joi.string().trim().min(2).max(200).required(),
    description:Joi.string().trim().min(2).required(),
    category:Joi.string().trim().required(),
  })
  return schema.validate(obj);
  
}

// Vildtat Updata Post 
function validateUpdataPost(obj) {
  const schema= Joi.object({
    title:Joi.string().trim().min(2).max(200),
    description:Joi.string().trim().min(2),
    category:Joi.string().trim(),
  })
  return schema.validate(obj);
  
}

module.exports={
  Post,
  validateUpdataPost,
  validateCreatePost 

}