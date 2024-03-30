const mongoose = require("mongoose");
const Joi = require("joi");

// Category Schema
const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true, // Corrected 'requireed' to 'required'
    trim: true,
  },
}, { timestamps: true });

// Category Model
const Category = mongoose.model("Category", CategorySchema);

// Validate Create Category
function validateCreateCategory(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().required().label("Title"),
  
  });
 
  return schema.validate(obj);
}
// // Validate Create Category
// function  test( ) {
//  console.log("test")
//  return 
// }

module.exports = {
  Category,
  validateCreateCategory,
 
};
