const express = require("express");

const app = express();

app.get("/api", (req, res) => {
	res.send("Hello World");
	console.log("api is running");
});

app.listen(5000, () => {
	console.log("Server is running on port 5000");
});
