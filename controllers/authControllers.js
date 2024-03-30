const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
 
const { User, validatedRegisterUser, validatedLoginUser } = require('../modules/User');
 
// Register New User
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validatedRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

 
  // Response To Client
  await user.save();

  res.status(201).json({ message: ' Login ' });
});

// Login User
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validatedLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Check if User Exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // 3. Check The Password
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }


  // 5. Generate Token (JWT)
  const token = user.generateWebToken();

  // 6. Response To Client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
    username: user.username,
  });
});

 