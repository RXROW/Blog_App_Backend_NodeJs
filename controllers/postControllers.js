const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const {
  Post,
  validateCreatePost,
  validateUpdataPost,
} = require("../modules/posts");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const {Comment} = require("../modules/comment");

// Create New Post
// /api/posts
// POST
// Only Logged in User

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // Step 1: Validation For Image
  if (!req.file) {
    return res.status(400).json({ message: "No Image Provided!" });
  }

  // Step 2: Validation For Data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Step 3: Upload Photo to Cloudinary
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Step 4: Create New Post and Save it in DB
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,  
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // Step 5: Send Response to Client
  res.status(201).json(post);

  // Step 6: Remove Image From Server
  fs.unlinkSync(imagePath);
});
// ----------------------------------------------
// Get All Post
// /api/posts
// GET
// Public
// ----------------------------------------------
module.exports.getAllPostCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 4;
  const { pageNumber, category } = req.query;
  let posts;
  if (!pageNumber && !category) {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});
// ----------------------------------------------
// Get Sngile Post
// /api/posts:id
// GET
// Public
// ----------------------------------------------
module.exports.getSngilePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  .populate("user", ["-password",])
  .populate("comments")

  if (!post) {
    return res.status(404).json({ message: "Post Not Found !" });
  }
  res.status(200).json(post);
});

// ----------------------------------------------
// Get Posts Count
// /api/posts/count
// GET
// Public
// ----------------------------------------------
module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();

  res.status(200).json(count);
});

// ----------------------------------------------
//  Delete Post
// /api/posts:id
// DELETE
// Only (Admin & Owner of this Post)
// ----------------------------------------------
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found !" });
  }
 
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);
    res
      .status(200)
      .json({
        message: "post has been deleted successfully ! ",
        postId: post._id,
      });
  } else {
    res.status(403).json({ message: "acess denied , forbdden ! " });
  }
  // TODO -----> Delete All Comments that belogn to this post
 
   await Comment.deleteMany({postId:post._id})
});

// Updata Post
// /api/posts/:id
// PUT
// Only Owner of this Post

module.exports.updataPostCtrl = asyncHandler(async (req, res) => {
  // Step 1: Validation
  const { error } = validateUpdataPost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Step 2: Get post from DB chick if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post  not found !" });
  }
  // Step 3: check if this post belong to logged in user
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "acess denied , forbdden ! " });
  }
  // Step 4: Updata post
  const updataPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);

  // Step 5: Send response to client
  res.status(200).json(updataPost);
});

// Updata Post Image
// /api/posts/upload-image/:id
// PUT
// Only Owner of this Post

module.exports.updataImagePostCtrl = asyncHandler(async (req, res) => {
  // Step 1: Validation

  if (!req.file) {
    return res.status(400).json({ message: "No image Provided ! " });
  }
  // Step 2: Get post from DB chick if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post  not found !" });
  }
  // Step 3: check if this post belong to logged in user
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "acess denied , forbdden ! " });
  }
  // Step 4: Delete old post Image
  await cloudinaryRemoveImage(post.image.publicId);

  // Step 5:  Upload New Photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  // Step 6:  Upload New Photo in db
  const updataPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  )
  // Step 7: Send response to client
  res.status(200).json(updataPost);
  // Step 8: Remove Image From  Server
  fs.unlinkSync(imagePath);
});

//  Like Toggle
// /api/posts/like/:id
// PUT
// Only Loged in user
module.exports.toggleLikeCtrl=asyncHandler(async(req,res)=>{
  const loggedInUser=req.params.id;
  const {id:postId}= req.params
  let post = await Post.findById(postId);
  if(!post){
    return res.status(404).json({message:"Post not Found ! "})
  }
  const isPostAlreadyLiked=post.likes.find((user)=>user.toString()===loggedInUser)
if(isPostAlreadyLiked){
  post=await Post.findByIdAndUpdate(postId,{
    $pull:{likes:loggedInUser}
  },{new:true});
}else{
  post=await Post.findByIdAndUpdate(postId,{
    $push:{likes:loggedInUser}
  },{new:true});
}
res.status(200).json(post)
})