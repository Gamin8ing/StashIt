// src/components/LoginForm.js
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
	Button,
	TextField,
	Box,
	Typography,
	InputAdornment,
	IconButton,
	Container,
	Paper,
} from "@mui/material";
import {
	EmailOutlined,
	LockOutlined,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Validation schema for Login
const loginValidationSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 8 characters")
		.required("Password is required"),
});

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		if (errorMessage) {
			toast.error(errorMessage);
		}
		if (successMessage) {
			toast.success(successMessage);
		}
	}, [errorMessage, successMessage]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
			<Container maxWidth="sm">
				<ToastContainer position="top-right" autoClose={3000} />

				<Box className="text-center mb-8">
					<div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-md">
						<LockOutlined className="text-blue-600 text-4xl" />
					</div>
					<Typography variant="h4" className="font-bold text-gray-800">
						Login to Your Account
					</Typography>
					<Typography variant="body1" className="text-gray-600 mt-2">
						Welcome back! Please login to continue.
					</Typography>
				</Box>

				<Paper elevation={3} className="rounded-xl">
					<Box className="p-8">
						<Formik
							initialValues={{ email: "", password: "" }}
							validationSchema={loginValidationSchema}
							onSubmit={async (values, { setSubmitting }) => {
								try {
									const response = await axios.post("/api/login", values);
									if (response) setSuccessMessage("Login successful!");
								} catch (error) {
									setErrorMessage(
										error.response?.data?.message ||
											"An error occurred during login"
									);
								} finally {
									setSubmitting(false);
								}
							}}
						>
							{({ isSubmitting, errors, touched }) => (
								<Form className="space-y-6">
									<Field name="email">
										{({ field, form }) => (
											<TextField
												{...field}
												fullWidth
												label="Email Address"
												variant="outlined"
												error={touched.email && !!errors.email}
												helperText={touched.email && errors.email}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<EmailOutlined className="text-gray-400" />
														</InputAdornment>
													),
												}}
												className={`bg-gray-50 ${
													form.errors.email && form.touched.email ? "shake" : ""
												}`}
											/>
										)}
									</Field>

									<Field name="password">
										{({ field, form }) => (
											<TextField
												{...field}
												fullWidth
												type={showPassword ? "text" : "password"}
												label="Password"
												variant="outlined"
												error={touched.password && !!errors.password}
												helperText={touched.password && errors.password}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<LockOutlined className="text-gray-400" />
														</InputAdornment>
													),
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																onClick={() => setShowPassword(!showPassword)}
																edge="end"
															>
																{showPassword ? (
																	<VisibilityOff />
																) : (
																	<Visibility />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
												className={`bg-gray-50 ${
													form.errors.password && form.touched.password
														? "shake"
														: ""
												}`}
											/>
										)}
									</Field>

									<Button
										type="submit"
										variant="contained"
										disabled={isSubmitting}
										fullWidth
										className="bg-blue-600 hover:bg-blue-700 py-3 text-lg normal-case rounded-lg"
									>
										{isSubmitting ? "Logging in..." : "Login"}
									</Button>
								</Form>
							)}
						</Formik>
					</Box>
				</Paper>
			</Container>
		</div>
	);
};

export default LoginForm;
