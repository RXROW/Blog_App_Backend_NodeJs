const express = require('express');
const router = express.Router();
const {getAllUsersCtrl, getUserProfileCtrl, UpdateUserProfileCtrl, getUsersCountCtrl, ProfilePhotoUploadCtrl,deleteUserProfileCtrl} = require('../controllers/userControllers');
const { virefyTokenAdmin, virefyTokenOnlayUser ,verifyToken ,virefyTokenAndAuthorization } = require('../middlewares/virefyToken');
const vaIIedateObjectId = require('../middlewares/vaIIedateObjectId');
const photoUpload = require('../middlewares/photoUpload');

// /api/users/profile
router.route("/profile").get(virefyTokenAdmin,getAllUsersCtrl);

// /api/user/profile/:id
router.route("/profile/:id")
                    .get(vaIIedateObjectId,getUserProfileCtrl)
                    .put(vaIIedateObjectId,virefyTokenOnlayUser,UpdateUserProfileCtrl)
                    .delete(vaIIedateObjectId,virefyTokenAndAuthorization,deleteUserProfileCtrl)
 

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
 .post(verifyToken, photoUpload.single("image"),ProfilePhotoUploadCtrl)
 

// /api/users/count
router.route("/count").get(virefyTokenAdmin,getUsersCountCtrl);

module.exports = router;