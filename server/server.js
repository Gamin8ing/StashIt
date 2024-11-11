const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// MongoDB URI and options
const uri = "mongodb://localhost:27017/myStash";
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET || "defaultSecret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		},
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for the frontend
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// MongoDB connection
mongoose
	.connect(uri, clientOptions)
	.then(() => console.log("DB connected!"))
	.catch((error) => console.error("Connection error:", error));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: { user: "anim8tor.ing@gmail.com", pass: process.env.APP_PASSWORD },
});

// User schema and model
const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, minLength: 6 },
	createdAt: { type: Date, default: Date.now },
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});
const User = mongoose.model("User", userSchema);

// Middleware to check authentication status
const isAuthenticated = (req, res, next) => {
	if (req.session.userId) next();
	else res.status(401).json({ message: "Unauthorized" });
};

// Routes
app.get("/api", (req, res) => {
	res.send("Hello World");
	console.log("API is running");
});

// Signup route
app.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ message: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, password: hashedPassword });
		await user.save();

		req.session.userId = user._id; // Start session after signup
		req.session.user = {
			name: user.name,
			email: user.email,
		};
		res.status(201).json({
			message: "User created successfully",
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("Signup error:", error);
		res
			.status(500)
			.json({ message: "Error creating user", error: error.message });
	}
});

// Login route
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" });

		req.session.userId = user._id; // Start session after successful login
		req.session.user = {
			name: user.name,
			email: user.email,
		};
		res.json({
			message: "Logged in successfully",
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Error logging in", error: error.message });
	}
});

// Logout route
app.post("/logout", isAuthenticated, (req, res) => {
	req.session.destroy((err) => {
		if (err)
			return res
				.status(500)
				.json({ message: "Error logging out", error: err.message });
		res.clearCookie("connect.sid");
		res.json({ message: "Logged out successfully" });
	});
});

// Auth verification route
app.get("/auth/verify", (req, res) => {
	// console.log("tried: ", req.session);
	if (req.session.userId) {
		res.status(200).json({ authenticated: true, user: req.session.user });
	} else {
		res
			.status(401)
			.json({ authenticated: false, message: "User not logged in" });
	}
});

// Forgot password route
app.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "No account with that email" });

		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const resetURL = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
		await transporter.sendMail({
			to: email,
			from: "anim8tor.ing@gmail.com",
			subject: "Password Reset",
			html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
		});
		res.status(200).json({ message: "Password reset link sent to your email" });
	} catch (error) {
		console.error("Forgot password error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Reset password route
app.post("/reset-password", async (req, res) => {
	try {
		const { email, token, newPassword } = req.body;
		const user = await User.findOne({
			email,
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user)
			return res.status(400).json({ message: "Invalid or expired token" });

		user.password = await bcrypt.hash(newPassword, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		res.status(200).json({ message: "Password has been reset successfully" });
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
