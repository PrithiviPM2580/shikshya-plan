import { linkOptions } from "@tanstack/react-router";

export const navbarLinkOptions = linkOptions([
	{
		to: "/",
		hash: "home",
		label: "Home",
		activeOptions: { exact: true },
	},
	{
		to: "/",
		hash: "features",
		label: "Features",
	},
	{
		to: "/",
		hash: "pricing",
		label: "Pricing",
	},
	{
		to: "/",
		hash: "contact",
		label: "Contact",
	},
]);
