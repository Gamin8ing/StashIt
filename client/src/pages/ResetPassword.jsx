import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Button,
	TextField,
	Box,
	Typography,
	Container,
	Paper,
	InputAdornment,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const email = queryParams.get("email");
	const token = queryParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (message) {
			toast.info(message);
		}
	}, [message]);

	const handleResetPassword = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/reset-password", {
				email,
				token,
				newPassword,
			});
			setMessage(response.data.message || "Password reset successful");
			// Redirect to login page after success
			setTimeout(() => navigate("/login"), 3000); // Wait for 3 seconds to show message, then redirect
		} catch (error) {
			setMessage("Error resetting password. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
			<Container maxWidth="sm">
				<ToastContainer position="top-right" autoClose={3000} />
				<Box className="text-center mb-8">
					<Typography variant="h4" className="font-bold text-gray-800">
						Reset Password
					</Typography>
					<Typography variant="body1" className="text-gray-600 mt-2">
						Enter your new password below
					</Typography>
				</Box>

				<Paper elevation={3} className="rounded-xl">
					<Box className="p-8">
						<form onSubmit={handleResetPassword} className="space-y-6">
							<TextField
								fullWidth
								label="New Password"
								type="password"
								variant="outlined"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockOutlined className="text-gray-400" />
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
								Reset Password
							</Button>
						</form>
					</Box>
				</Paper>
			</Container>
		</div>
	);
};

export default ResetPassword;
