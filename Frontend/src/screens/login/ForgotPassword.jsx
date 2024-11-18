// src/components/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3000/api/v1/users/forgot-password",
				{ email }
			);
			setMessage(response.data.message);
		} catch (error) {
			setMessage("Error sending reset email. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
					Forgot Password
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
					>
						Send Reset Link
					</button>
				</form>
				{message && (
					<p
						className={`mt-4 text-center ${
							message.includes("Error") ? "text-red-500" : "text-green-500"
						}`}
					>
						{message}
					</p>
				)}
			</div>
		</div>
	);
}
