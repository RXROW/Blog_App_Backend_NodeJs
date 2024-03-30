const express = require('express');
const router = express.Router();
const photoUpload = require("../middlewares/photoUpload");
const {verifyToken, virefyTokenAdmin} = require("../middlewares/virefyToken");  
const { createCommentCtrl, getAllCommentsCtrl, DeleteCommentCtrl, updataCommentCtrl } = require('../controllers/commentsControllers');
const vaIIedateObjectId = require('../middlewares/vaIIedateObjectId');


// api/comments
router.route("/")
      .post(verifyToken,createCommentCtrl)
      .get(virefyTokenAdmin,getAllCommentsCtrl);
     
// api/comments/:id
router.route("/:id")
      .delete(vaIIedateObjectId,verifyToken,DeleteCommentCtrl)
      .put(vaIIedateObjectId,verifyToken,updataCommentCtrl)
     
module.exports = router;
