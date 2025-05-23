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
  return jwt.sign(payload, secret, { expiresIn: "1d" });
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
    console.log(req.body);
    const { username, email, dob, password, addressesToTrack, role} = req.body;
    
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
      role:role,
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
    res.cookie("uid", token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "None", 
      // domain: "hodlsync.com",
      // path: "/"
    });
    console.log("Set-Cookie Header Sent:", res.getHeaders()["set-cookie"]);
    
  

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
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while fetching users.',
//     });
//   }
// };

/**
 * Get a single user by ID.
 */
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found.',
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while fetching the user.',
//     });
//   }
// };

/**
 * Update a user by ID.
 */
// exports.updateUser = async (req, res) => {
//   try {
//     const updatedData = req.body;
//     const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true, // Return the updated document
//       runValidators: true, // Validate the update against the schema
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found.',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//       message: 'User updated successfully!',
//     });
//   } catch (error) {
//     console.error('Error updating user:', error.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while updating the user.',
//     });
//   }
// };

/**
 * Delete a user by ID.
 */
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found.',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'User deleted successfully!',
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while deleting the user.',
//     });
//   }
// };

exports.logout = (req, res) => {
  res.clearCookie("uid", {  
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "strict",  
    path: "/"  
  });

  res.json({ message: "Logged out successfully" });
};


exports.dashboard = (req,res)=>{
  console.log("Dashboard route hit");

  res.json({ message: "Welcome to your dashboard!", user: req.user })
};


exports.addressAdd = async (req, res) => {
  try {
    const { address } = req.body;
    const email = req.user.email; // Assuming authentication middleware adds `user` to `req`

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // Use `findOne` instead of `findById`
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add address to `addressesToTrack` array
    user.addressesToTrack.push(address);
    await user.save();

    res.status(200).json({ message: "Address added successfully", addressesToTrack: user.addressesToTrack });
  } catch (error) {
    console.error("Error:", error); // Log the actual error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.fetchAddresses = async (req, res) => {
  try {
    const email = req.user?.email; // Ensure req.user exists before accessing email
    if (!email) {
      return res.status(401).json({ success: false, error: "Unauthorized: No email found in request." });
    }

    console.log("Fetching addresses for email:", email); // Debugging log

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    console.log("User found:", user); // Debugging log

    res.status(200).json({ success: true, addresses: user.addressesToTrack || [] });
  } catch (error) {
    console.error("Error in fetchAddresses:", error); // Logs error in console
    res.status(500).json({ success: false, error: "Server error while fetching the user." });
  }
};


// In your backend (e.g., controllers/userController.js)

exports.deleteAddress = async (req, res) => {
  try {
    const { address } = req.body; // Address to delete from req.body
    const email = req.user.email; // Match your auth middleware

    // Validate input
    if (!address || typeof address !== "string") {
      return res.status(400).json({ message: "Invalid address provided" });
    }

    // Find user by email
    const User = require("../models/User"); // Adjust path to your User model
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the address exists in addressesToTrack
    if (!user.addressesToTrack.includes(address)) {
      return res.status(404).json({ message: "Address not found in tracked list" });
    }

    // Remove the address from addressesToTrack
    user.addressesToTrack = user.addressesToTrack.filter((addr) => addr !== address);
    await user.save();

    return res.status(200).json({ message: "Address deleted successfully", addressesToTrack: user.addressesToTrack });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.testCookie = async(req,res)=>{
  res.cookie("test", "hello", { 
    httpOnly: true, 
    secure: true, 
    sameSite: "None", 
    path: "/"
  });
  res.send("Cookie sent!");
};