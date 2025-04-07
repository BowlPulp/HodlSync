// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require("../middlewares/authMiddleware");

// Non Protected Routes
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.post("/logout", userController.logout);

router.post('/test', (req,res)=>{
    res.send("test");
})

// Protected Routes
router.get('/dashboard', authenticate, userController.dashboard);
router.patch('/add-address', authenticate, userController.addressAdd);
router.get("/fetch-addresses", authenticate, userController.fetchAddresses);
router.patch("/remove-address", authenticate, userController.deleteAddress);

//Test Route
router.get('/test-cookie', userController.testCookie);
// Get all users
// router.get('/users', userController.getAllUsers);

// Get a user by ID
// router.get('/:id', userController.getUserById);

// Update a user by ID
// router.put('/:id', userController.updateUser);

// Delete a user by ID
// router.delete('/:id', userController.deleteUser);

module.exports = router;
