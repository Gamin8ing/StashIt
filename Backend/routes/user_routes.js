import express from "express";
import {
  getAllUsers,
  getMyprofile,
  login,
  logout,
  register,
} from "../controllers/user_controllers.js";
import { isAuthenticated } from "../middlewares/user_auth.js";
import User from "../models/user_model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "anim8tor.ing@gmail.com",
    pass: "mxnbwpdvnbdfhfvx",
  },
});

const router = express.Router();

router.post("/new", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/all", getAllUsers);

router.patch("/chage-role", isAuthenticated, async (req, res) => {
  const { targetUserId, role } = req.body;
  const user = req.user;
  if (!targetUserId) {
    return res.status(404).json({ message: "please provide target user id" });
  }
  if (user.role !== "admin") {
    return res
      .status(400)
      .json({ message: "Not authorized to make this call" });
  }

  await User.findByIdAndUpdate(targetUserId, {
    $set: {
      role: role,
    },
  });

  return res.status(200).json({ message: "success" });
});



router.get("/me", isAuthenticated, getMyprofile);

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const us = await User.findOne({email});
  if (!us) {
    return res.status(400).json({ message: "User not found." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  us.resetPasswordToken = token;
  us.resetPasswordExpires = Date.now() + 3600000;
  await us.save();

  const resetLink = `http://localhost:5173/auth/reset-password?token=${token}&email={email}`;

  try {
    await transporter.sendMail({
      from: "anim8tor.ing@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<h1>StashIt</h1><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
    res.json({ message: "Reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email." });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  const {email,token, newPassword} = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,

      resetPasswordExpires: {$gt: Date.now()}
    })
    if (!users[email]) {
      return res.status(400).json({ message: "Invalid user." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    res.status(200).json({message: "password rest success"});
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

export default router;
