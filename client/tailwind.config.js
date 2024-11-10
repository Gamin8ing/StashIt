/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				blue: {
					50: "#EBF5FF",
					// ... other blue shades
					600: "#2563EB",
					700: "#1D4ED8",
					800: "#1E40AF",
				},
			},
		},
	},
	plugins: [],
};
