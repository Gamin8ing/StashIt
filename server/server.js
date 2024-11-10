const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const uri = "mongodb://localhost:27017/myStash";
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const app = express();

// CORS configuration for frontend
app.use(
	cors({
		origin: "http://localhost:5173", // Vite's default port
		credentials: true,
	})
);

// Session configuration
app.use(
	session({
		secret: "My little secret here, shhhhh",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production", // Only use secure in production
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		},
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
	.connect(uri, clientOptions)
	.then(() => {
		console.log("DB connected!");
	})
	.catch((error) => {
		console.error("Connection error:", error);
	});

// Modified Schema with additional validation
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("User", userSchema);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};

// Routes
app.get("/api", (req, res) => {
	res.send("Hello World");
	console.log("api is running");
});

// Signup route
app.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				message: "email already exists",
			});
		}

		// Hash password
		// const salt = await bcrypt.genSalt(10);
		const hashedPassword = bcrypt.hash(password, 10, (err, hash) => {
			// Create new user
			const user = new User({
				name: name,
				email: email,
				password: hash,
			});

			user.save();

			// Start session
			req.session.userId = user._id;

			res.status(201).json({
				message: "User created successfully",
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
				},
			});
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({
			message: "Error creating user",
			error: error.message,
		});
	}
});

// Login route
app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		// Find user
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({
				message: "Invalid credentials",
			});
		}

		//right compare passwd
		bcrypt.compare(password, user.password, (err, isMatch) => {
			if (err) {
				console.error("Login error:", err);
				return res.status(500).json({
					message: "Error logging in",
					error: err.message,
				});
			}

			if (!isMatch) {
				return res.status(400).json({
					message: "Invalid credentials",
				});
			}

			// Start session
			req.session.userId = user._id;

			res.json({
				message: "Logged in successfully",
				user: {
					id: user._id,
					name: user.name,
					username: user.username,
				},
			});
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			message: "Error logging in",
			error: error.message,
		});
	}
});

// Logout route
app.post("/logout", isAuthenticated, (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({
				message: "Error logging out",
				error: err.message,
			});
		}
		res.clearCookie("connect.sid");
		res.json({ message: "Logged out successfully" });
	});
});

// Get current user route
app.get("/me", isAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.session.userId).select("-password");
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		res.json(user);
	} catch (error) {
		console.error("Get user error:", error);
		res.status(500).json({
			message: "Error getting user",
			error: error.message,
		});
	}
});

app.listen(5000, () => {
	console.log("Server is running on port 5000");
});
