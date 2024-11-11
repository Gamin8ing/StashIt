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
	Link,
	Alert,
	Collapse,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	PersonOutline,
	EmailOutlined,
	LockOutlined,
	AccountCircle,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../App"; // Import AuthContext

const signupValidationSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Name is too short")
		.max(50, "Name is too long")
		.required("Name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Must contain uppercase, lowercase, and number"
		)
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Passwords must match")
		.required("Please confirm your password"),
});

const SignupForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const { setIsAuthenticated, setUser } = useAuth();
	const navigate = useNavigate();

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
						<AccountCircle className="text-blue-600 text-4xl" />
					</div>
					<Typography variant="h4" className="font-bold text-gray-800">
						Create Account
					</Typography>
					<Typography variant="body1" className="text-gray-600 mt-2">
						Join us today and explore our services
					</Typography>
				</Box>

				<Paper elevation={3} className="rounded-xl">
					<Box className="p-8">
						<Formik
							initialValues={{
								name: "",
								email: "",
								password: "",
								confirmPassword: "",
							}}
							validationSchema={signupValidationSchema}
							onSubmit={async (values, { setSubmitting, resetForm }) => {
								try {
									const response = await axios.post("/api/signup", {
										name: values.name,
										email: values.email,
										password: values.password,
									});
									if (response) {
										setSuccessMessage("Account created successfully!");
										setIsAuthenticated(true);
										setUser(response.data.user);
										resetForm();
										setSubmitting("false");
										navigate("/dashboard");
									}
								} catch (error) {
									setErrorMessage(
										error.response?.data?.message ||
											"An error occurred during signup"
									);
								} finally {
									setSubmitting(false);
								}
							}}
						>
							{({ isSubmitting, errors, touched }) => (
								<Form className="space-y-6">
									<div className="space-y-4">
										<Field name="name">
											{({ field, form }) => (
												<TextField
													{...field}
													fullWidth
													label="Full Name"
													variant="outlined"
													error={touched.name && !!errors.name}
													helperText={touched.name && errors.name}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<PersonOutline className="text-gray-400" />
															</InputAdornment>
														),
													}}
													className={`bg-gray-50 ${
														form.errors.name && form.touched.name ? "shake" : ""
													}`}
												/>
											)}
										</Field>

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
														form.errors.email && form.touched.email
															? "shake"
															: ""
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

										<Field name="confirmPassword">
											{({ field, form }) => (
												<TextField
													{...field}
													fullWidth
													type={showConfirmPassword ? "text" : "password"}
													label="Confirm Password"
													variant="outlined"
													error={
														touched.confirmPassword && !!errors.confirmPassword
													}
													helperText={
														touched.confirmPassword && errors.confirmPassword
													}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<LockOutlined className="text-gray-400" />
															</InputAdornment>
														),
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	onClick={() =>
																		setShowConfirmPassword(!showConfirmPassword)
																	}
																	edge="end"
																>
																	{showConfirmPassword ? (
																		<VisibilityOff />
																	) : (
																		<Visibility />
																	)}
																</IconButton>
															</InputAdornment>
														),
													}}
													className={`bg-gray-50 ${
														form.errors.confirmPassword &&
														form.touched.confirmPassword
															? "shake"
															: ""
													}`}
												/>
											)}
										</Field>
									</div>

									<Button
										type="submit"
										variant="contained"
										disabled={isSubmitting}
										fullWidth
										className="bg-blue-600 hover:bg-blue-700 py-3 text-lg normal-case rounded-lg"
									>
										{isSubmitting ? (
											<span className="flex items-center">
												Creating Account...
											</span>
										) : (
											"Create Account"
										)}
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

export default SignupForm;
