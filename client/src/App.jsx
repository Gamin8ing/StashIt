import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [user, setUser] = useState(null);
	const checkAuthStatus = async () => {
		try {
			console.log("he");
			const response = await axios.get("/api/auth/verify", {
				withCredentials: true,
			});
			setIsAuthenticated(response.data.authenticated);
			setUser(response.data.user);
			console.log("he2", response);
		} catch (e) {
			console.log("error coming is: ", e);
			setIsAuthenticated(false);
		}
	};

	// Check auth status on app load
	useEffect(() => {
		checkAuthStatus();
	}, []);

	// Protect routes that require authentication
	const ProtectedRoute = ({ children }) => {
		return isAuthenticated ? children : <Navigate to="/login" />;
	};

	return (
		<>
			<AuthContext.Provider
				value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
			>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/about" element={<h1>About</h1>} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					{/* Protected Dashboard Route */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthContext.Provider>
		</>
	);
}

export default App;
