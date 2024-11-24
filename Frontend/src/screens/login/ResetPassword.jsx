import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
	const { token, email } = useParams();
	const the = useParams();
	console.log("token: " + token);
	console.log(the);
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(email + password + token);
		try {
			const response = await axios.post(
				`http://localhost:3000/api/v1/users/reset-password`,
				{ email, token, password }
			);
			setMessage(response.data.message);
		} catch (error) {
			setMessage("Error resetting password. Please try again.");
		}
	};

	return (
		<div className="flex items-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 lg:justify-center">
			<div className="flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-center text-gray-700">
					Reset Password
				</h2>
				<p className="mt-2 text-sm text-center text-gray-600">
					Please enter your new password below to reset your account password.
				</p>
				<form className="mt-6 space-y-5" onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-1">
						<label
							htmlFor="password"
							className="text-sm font-semibold text-gray-500"
						>
							New Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="Enter new password"
							className="px-4 py-2 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-4 focus:ring-indigo-300"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-500 rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
					>
						Reset Password
					</button>
				</form>
				{message && (
					<p
						className={`mt-4 text-center text-sm ${
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
