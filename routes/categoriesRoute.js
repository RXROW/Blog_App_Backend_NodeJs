const express = require('express');
const router = express.Router();
 
const {  virefyTokenAdmin} = require("../middlewares/virefyToken");  
const { validateCreateCategory    } = require('../modules/Category');
const { createCategoryCtrl, getAllCategoriesCtrl, deleteCategoryCtrl } = require('../controllers/categoriesControllers');
const vaIIedateObjectId = require('../middlewares/vaIIedateObjectId');
 
// api/categories  
router.route("/")
      .post(virefyTokenAdmin,createCategoryCtrl )
      .get(getAllCategoriesCtrl)
 
// api/categories/:id
router.route("/:id")
.delete(vaIIedateObjectId, virefyTokenAdmin,deleteCategoryCtrl);
       
 
            
module.exports = router;
