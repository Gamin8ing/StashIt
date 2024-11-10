import React from "react";
import { Link } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Button,
	Typography,
	Container,
	Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import StashItLogo from "@mui/icons-material/Inventory2Outlined"; // Example icon

// Styles using MUI and Tailwind CSS
const useStyles = makeStyles(() => ({
	navBar: {
		backgroundColor: "#1a202c",
	},
	heroText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: "2.5rem",
	},
	subText: {
		color: "#d1d5db",
		fontSize: "1.25rem",
		marginBottom: "1.5rem",
	},
	buttons: {
		backgroundColor: "#4f46e5",
		color: "#fff",
		"&:hover": {
			backgroundColor: "#3b82f6",
		},
		marginRight: "1rem",
	},
}));

const Landing = () => {
	const classes = useStyles();

	return (
		<>
			<AppBar position="static" className={classes.navBar}>
				<Container maxWidth="lg">
					<Toolbar>
						<Box display="flex" alignItems="center" flexGrow={1}>
							<StashItLogo style={{ fontSize: "2rem", color: "#fff" }} />
							<Typography variant="h6" color="inherit" sx={{ ml: 1 }}>
								StashIt
							</Typography>
						</Box>

						<Button
							component={Link}
							to="/login"
							className={classes.buttons}
							color="white"
						>
							Login
						</Button>
						<Button
							component={Link}
							to="/signup"
							className={classes.buttons}
							color="white"
						>
							Signup
						</Button>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Hero Section */}
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				height="100svh"
				className=""
			>
				<Container maxWidth="md">
					<Typography variant="h1" fontWeight={600}>
						Welcome to StashIt
					</Typography>
					<Typography
						variant="subtitle1"
						className="text-gray-500"
						fontWeight={400}
					>
						Your one-stop solution for managing your stash effortlessly.
					</Typography>
					<Box mt={4} className="flex justify-center gap-6">
						<Button
							component={Link}
							to="/signup"
							variant="contained"
							size="large"
							className={classes.buttons}
						>
							Get Started
						</Button>
						<Button
							component={Link}
							to="/login"
							variant="outlined"
							size="large"
							className="border-white text-white ml-4 hover:bg-white hover:text-blue-500"
							style={{ borderColor: "white" }}
						>
							Login
						</Button>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Landing;
