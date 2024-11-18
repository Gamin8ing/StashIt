import React, { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import DashBoardScreen from "./DashBoardScreen";
import loginLogo from "../../assets/authenticate.svg";
import SideNavbar from "../../components/SideNavbar";
import { SERVER_URL } from "../../router";

function DashBoardLayout() {
	const navigator = useNavigate();
	const [data, setData] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetchUserInfo();
	}, []);

	const fetchUserInfo = async () => {
		try {
			const { data, status } = await axios.get(
				`${SERVER_URL}/api/v1/users/me`,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log(data);
			if (status === 400) {
				// navigator("/auth");
			}
			if (status === 200) {
				setData(data);
				setUser(data.user);
				setLoading(false);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{!data && <br />}
			{!data && (
				<div className="container mx-auto w-2/4 text-center mb-3 px-3 py-1 border-2 border-yellow-600 bg-yellow-100 rounded-md text-yellow-800">
					Your are not authenticated, please login to continue.
				</div>
			)}

			{/* Loading spinner animation */}
			{isLoading && (
				<div className="min-h-screen flex items-center justify-center">
					<div className="flex flex-col gap-4">
						<div className="h-12 w-12 border-b-2 border-l-2 border-r-2 border-black border-t-white animate-spin rounded-full"></div>
						<h1 className="font-semibold animate-pulse">Loading</h1>
					</div>
				</div>
			)}

			{/* Showing the data from the database */}
			{data && <HeaderBar user={data.user} />}
			{data && (
				<div className="grid grid-rows-10 grid-cols-10 lg:grid-cols-12 gap-2 h-screen w-full overflow-y-hidden">
					<div className="h-14 bg-red-400 col-span-10 lg:col-span-12"></div>

					<div className="row-span-9 overflow-y-auto col-span-3 lg:col-span-2 h-full">
						<SideNavbar />
					</div>

					<div className="row-span-9 overflow-y-auto col-span-7 lg:col-span-10 h-full">
						<Outlet context={[data, user]} />
					</div>
				</div>
			)}

			{/* Home screen unauthenticated layout */}
			{!data && (
				<div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-500 to-indigo-600 items-center justify-center relative">
					{/* Header */}
					<div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-white">StashIt</h1>
						<div className="space-x-4">
							<Link
								to="auth"
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
							>
								Login
							</Link>
							<Link
								to="signup"
								className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
							>
								Signup
							</Link>
						</div>
					</div>

					{/* Main Content */}
					<div className="relative flex flex-col gap-4">
						<img
							src={loginLogo}
							alt="Authenticate"
							className="w-3/4 max-w-lg mx-auto opacity-80"
						/>
						<div className="  text-center text-white p-4">
							<Link
								to="auth"
								className="px-6 py-3 rounded-md text-lg bg-blue-700 hover:bg-blue-800"
							>
								Login Now
							</Link>
							<p className="mt-4">
								Don’t have an account?{" "}
								<Link
									to="/auth/signup"
									className="underline hover:text-blue-300 transition-all"
								>
									Sign up here
								</Link>
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default DashBoardLayout;
