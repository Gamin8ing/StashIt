import React from "react";
import { Link } from "react-router-dom";

// const axios = require("axios");

const Landing = () => {
	// const data = axios.get("/api");
	return (
		<div>
			<h1>Welcome to StashIt</h1>

			<p>Your one-stop solution for managing your stash.</p>
			<Link to={"/signup"}>Signup </Link>
			<Link to={"/login"}>Login </Link>
		</div>
	);
};

export default Landing;
