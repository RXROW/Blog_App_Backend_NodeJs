const asyncHandler = require("express-async-handler");
 
const {Comment , validateCreateComment,validateUpdataComment} = require("../modules/comment");
const {User} = require('../modules/User');

// Create New Comment
// /api/comments
// POST
// Only Logged in User
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const {error} = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const pofile=await User.findById(req.user.id);

  const comment =await  Comment.create({
    postId:req.body.postId,
    text:req.body.text,
    user:req.user.id,
    username:pofile.username,
  })
  res.status(201).json(comment);
});

// Get All Comments
// /api/comments
// GET
// Only Admin
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments =await Comment.find().populate("user")
  res.status(200).json(comments);
});


// Delete Comment
// /api/comments/:id
// DELETE
// Only Admin or Owner of Comment
module.exports.DeleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment =await Comment.findById(req.params.id);
  if(!comment){
    res.status(404).json({message:"Comment Is Not Found !"});
  }

  if(req.user.isAdmin || req.user.id=== comment.user.toString()){
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Comment has been Deleted Successfully ! "});
  }else{
    res.status(403).json({message:" access denied, not allowed !"});
  }
   
});

//  Updata Comment
// /api/comments/:id
// PUT
// Only Owner of Comment
module.exports.updataCommentCtrl = asyncHandler(async (req, res) => {
  const {error} = validateUpdataComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const comment=await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(400).json({ message: "Comment Is Not Found !"});
  }
  
  if(req.user.id!== comment.user.toString()){
    res.status(403).json({message:" access denied, not allowed !"});

  } 
    const updataComment=await Comment.findByIdAndUpdate(req.params.id,{
      $set:{
        text:req.body.text,
      }
    },{new:true});   
  res.status(200).json(updataComment);
});
