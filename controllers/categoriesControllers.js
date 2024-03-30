const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require('../modules/Category');

// Create New Category
// /api/categories
// POST
// Only Admin
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
     return res.status(400).json({ message: error.details[0].message });
   
  }

  try {
 
    const category = await Category.create({
      title: req.body.title,
      user: req.user.id,
    });

    res.status(201).json( 
      category 
     );
  } catch (error) {
   
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Categories
// /api/categories
// GET
// puplic  
module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const  categories =await Category.find();
  res.status(200).json(categories );

 
});

// Delete Category
// /api/categories
// DELETE
// Only Admin
 
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const  category =await Category.findById(req.params.id);
  if(!category){
    return res.status(404).json({ message: "Category Not Found !" });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
     message: "Category has been deleted successfully ! ",
     categoryId : category._id});

 
});

