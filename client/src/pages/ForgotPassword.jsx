import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
	Button,
	TextField,
	Box,
	Typography,
	Container,
	Paper,
	InputAdornment,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (message) {
			toast.info(message);
		}
	}, [message]);

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/forgot-password", { email });
			setMessage(
				response.data.message || "Check your email for the reset link"
			);
			// Redirect to login page after success
			setTimeout(() => navigate("/login"), 3000); // Wait for 3 seconds to show message, then redirect
		} catch (error) {
			setMessage("Error sending reset link. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
			<Container maxWidth="sm">
				<ToastContainer position="top-right" autoClose={3000} />
				<Box className="text-center mb-8">
					<Typography variant="h4" className="font-bold text-gray-800">
						Forgot Password
					</Typography>
					<Typography variant="body1" className="text-gray-600 mt-2">
						Enter your email to receive a password reset link
					</Typography>
				</Box>

				<Paper elevation={3} className="rounded-xl">
					<Box className="p-8">
						<form onSubmit={handleForgotPassword} className="space-y-6">
							<TextField
								fullWidth
								label="Email Address"
								variant="outlined"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlined className="text-gray-400" />
										</InputAdornment>
									),
								}}
							/>
							<Button
								type="submit"
								variant="contained"
								fullWidth
								className="bg-blue-600 hover:bg-blue-700 py-3 text-lg normal-case rounded-lg"
							>
								Send Reset Link
							</Button>
						</form>
					</Box>
				</Paper>
			</Container>
		</div>
	);
};

export default ForgotPassword;
