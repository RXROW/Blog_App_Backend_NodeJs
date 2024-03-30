const express = require('express');
const router = express.Router();
const photoUpload = require("../middlewares/photoUpload");
const {verifyToken} = require("../middlewares/virefyToken"); // Corrected typo
const { createPostCtrl, 
   getAllPostCtrl, 
   getSngilePostCtrl,
   getPostCountCtrl, 
   deletePostCtrl,
   updataPostCtrl,
   updataImagePostCtrl, 
   toggleLikeCtrl} = require('../controllers/postControllers');
const valledateObjectId=require("../middlewares/vaIIedateObjectId")
// api/posts
router.route("/")
      .post(verifyToken, photoUpload.single("image"), createPostCtrl)
      .get(getAllPostCtrl);
// api/posts/count
router.route("/count")
      .get(getPostCountCtrl);
// api/posts/:id
router.route("/:id")
.get(valledateObjectId,getSngilePostCtrl)
.delete(valledateObjectId,verifyToken,deletePostCtrl)
.put(valledateObjectId,verifyToken,updataPostCtrl)

// api/posts/updata-image/:id
router.route("/update-image/:id")
.put(valledateObjectId,verifyToken,photoUpload.single("image"), updataImagePostCtrl)
 
// api/posts/like/:id
router.route("/like/:id")
      .put(valledateObjectId,verifyToken,toggleLikeCtrl);
 

module.exports = router;
