import plugin from "tailwindcss/plugin";

const breakpoints = {
	sm: "575px",
	md: "750px",
	lg: "990px",
	xl: "1400px",
	xxl: "1600px",
};

module.exports = {
	content: [
		"./layout/*.liquid",
		"./sections/*.liquid",
		"./snippets/*.liquid",
		"./templates/*.liquid",
		"./blocks/*.liquid",
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
				lg: "3rem",
				xl: "4rem",
			},
			screens: breakpoints,
		},
		extend: {
			screens: breakpoints,
			colors: {
				primary: "#114273",
			},
		},
	},
	safelist: [],
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({});
		}),
	],
};
