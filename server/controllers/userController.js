// controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const secret = process.env.JWT_SECRET
const bcrypt = require("bcryptjs");

function setUser(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    dob: user.dob,
    addressesToTrack: user.addressesToTrack,
  };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function getUser(token){
  if(!token){
    return null;
  }
  return jwt.verify(token, secret)
}
/**
 * Create a new user.
 * Expected data in req.body: { username, email, dob, password, addressesToTrack }
 */
exports.createUser = async (req, res) => {
  try {
    const { username, email, dob, password, addressesToTrack} = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use.",
      });
    }
    
    // Encrypt Password to store
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user document using the User model
    const user = new User({
      username,
      email: email.toLowerCase(),
      dob,
      password: hashedPassword,
      // addressesToTrack is optional; defaults to an empty array if not provided
      addressesToTrack: addressesToTrack || [],
    });

    // Save the user in the database
    await user.save();

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully!',
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while creating user.',
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Received password:", password);
    // console.log("Stored hashed password:", user.password);
    // console.log("Password match status:", isMatch);
    
    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User Not found",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = setUser(user);
    res.cookie("uid", token);

    res.status(200).json({
      success: true,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while logging in.",
    });
  }
};

/**
 * Get all users.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users.',
    });
  }
};

/**
 * Get a single user by ID.
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching the user.',
    });
  }
};

/**
 * Update a user by ID.
 */
exports.updateUser = async (req, res) => {
  try {
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully!',
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating the user.',
    });
  }
};

/**
 * Delete a user by ID.
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting the user.',
    });
  }
};
