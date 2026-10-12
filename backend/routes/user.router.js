const express = require("express");
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/userProfile", protect, userController.getUserProfile);
userRouter.put("/updateProfile", protect, userController.updateUserProfile);
userRouter.delete("/deleteProfile", protect, userController.deleteUserProfile);

module.exports = userRouter;
