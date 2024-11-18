import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../router";

function LoginScreen() {
	const [formData, setData] = useState({
		email: "",
		password: "",
	});

	const history = useNavigate(); // Use useNavigate for navigation

	function handleInputChange(e) {
		setData({ ...formData, [e.target.id]: e.target.value });
	}

	async function handleSignIn(e) {
		e.preventDefault();

		try {
			const { data, status } = await axios.post(
				`${SERVER_URL}/api/v1/users/login`,
				formData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (status === 201) {
				history("/"); // Redirect to home upon successful login
			} else {
				alert("Wrong credentials. Check Email and Password.");
			}
		} catch (error) {
			console.error("Something went wrong:", error);
			alert("Something went wrong.");
		}
	}

	return (
		<div className="flex items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 lg:justify-center">
			<div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg md:flex-row md:flex-1 lg:max-w-screen-md">
				{/* Left Section */}
				<div className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
					<div className="my-3 text-4xl font-bold tracking-wider text-center">
						<a href="#">StashIt</a>
					</div>
					<p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
						Effortlessly track, manage, and optimize your inventory with
						StashIt—your all-in-one solution for smarter stock control!
					</p>
					<p className="flex flex-col items-center justify-center mt-10 text-center">
						<span>Don't have an account?</span>
						<Link
							to={"signup"}
							className="mt-1 underline text-blue-300 hover:text-white"
						>
							Get Started!
						</Link>
					</p>
					<p className="mt-6 text-sm text-center text-gray-300">
						Read our{" "}
						<a href="#" className="underline hover:text-white">
							terms
						</a>{" "}
						and{" "}
						<a href="#" className="underline hover:text-white">
							conditions
						</a>
					</p>
				</div>

				{/* Right Section */}
				<div className="p-5 bg-white md:flex-1">
					<h3 className="my-4 text-2xl font-semibold text-gray-700">
						Account Login
					</h3>
					<form
						action="#"
						className="flex flex-col space-y-5"
						onSubmit={(e) => handleSignIn(e)}
					>
						{/* Email Field */}
						<div className="flex flex-col space-y-1">
							<label
								htmlFor="email"
								className="text-sm font-semibold text-gray-500"
							>
								Email Address
							</label>
							<input
								onChange={handleInputChange}
								type="email"
								id="email"
								value={formData.email}
								autoFocus
								required
								className="px-4 py-2 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
								placeholder="Enter your email"
							/>
						</div>

						{/* Password Field */}
						<div className="flex flex-col space-y-1">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="text-sm font-semibold text-gray-500"
								>
									Password
								</label>
							</div>
							<input
								type="password"
								id="password"
								value={formData.password}
								onChange={handleInputChange}
								required
								className="px-4 py-2 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
								placeholder="Enter your password"
							/>
						</div>

						{/* Remember Me Checkbox */}
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="remember"
								className="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200"
							/>
							<label
								htmlFor="remember"
								className="text-sm font-semibold text-gray-500"
							>
								Remember Me
							</label>
						</div>

						{/* Forgot Password Link */}
						<div>
							<a
								onClick={() => history("/auth/forgot-password")}
								className="text-blue-600 hover:underline cursor-pointer"
							>
								Forgot Password?
							</a>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
							>
								Log in
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default LoginScreen;
