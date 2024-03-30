const asyncHandler = require("express-async-handler");
const { User, validatedUpdateUser } = require("../modules/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryMultipleImage
} = require("../utils/cloudinary");
const {Post} = require('../modules/posts');
const {Comment} = require('../modules/comment');

// Get All Users
// /api/users/profile
// Get
// Onlay Admin
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users).populate("posts");
});

// Get User Profile
// /api/users/profile/:id
// Get
//  public
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
  if (!user) {
    return res.status(400).json({ massage: " User Not Found ! " });
  }
  res.status(200).json(user);
});

// Update User Profile
// /api/users/profile/:id
// PUT
// Private (onlay User himself)
module.exports.UpdateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validatedUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ massage: error.details[0] });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    {
      new: true,
    }
  ).select("-password").populate("posts");

  if (!updateUser) {
    return res
      .status(404)
      .json({ message: "User not found or update failed", updateUser });
  }

  return res.status(200).json(updateUser);
});

// Get Users Count
// /api/users/count
// Get
// Onlay Admin
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});

// Upload Profile Photo
// /api/users/profile/profile-photo-upload
// POST
// Onlay Logged in user
module.exports.ProfilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  //  1- Valedation
  if (!req.file) {
    res.status(400).json({ massage: "No File provided" });
  }
  // 2-  Get Path
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3-  Upload to Cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  // console.log(result);

  // 4-   Get User From Db
  const user = await User.findById(req.user.id);

  // 5-    Delete the old profile photo
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 6-   Change the prfile photo file in the db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  // 7-    Send to client
  res.status(200).json({
    massage: "Your profile photo uploaded successfully ",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  // 8-    Remove image from the server
  fs.unlinkSync(imagePath);
});

// Delete User Profile (Account)
// /api/users/profile/:id
// DELETE
// Private (onlay Admin or  User himself)

module.exports.deleteUserProfileCtrl =asyncHandler(async (req,res)=>{
  // 1- Get User From db
  const user =await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({massage:"User not found ! "});
  }

 
  // 2- Get All Posts From db
  const posts =await Post.find({ user:user._id});
  // 3- Get the Public ids From db
  const publicIds =posts?.map((post)=>post.image.publicId);
  // 4- Delete All Posts & Image From cloudinary that belong this User
  if(publicIds?.length >0 ){
    await cloudinaryMultipleImage(publicIds);
  }
 

  // 5- Delete User Profile Pecture From cloudinary

  if(user.profilePhoto.publicId !== null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

 
  // 6- Delete User Posts & Comments 
  await Post.deleteMany({user:user._id})
  await Comment.deleteMany({user:user._id})
   

  // 7- Delete User Himself 
  await User.findByIdAndDelete(req.params.id);



  // 8- Send Response to the Client
      res.status(200).json({massage:"Your Profile has been deleted ! "});


});
