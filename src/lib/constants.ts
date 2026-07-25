import { linkOptions } from "@tanstack/react-router";
import {
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	LayoutDashboard,
	Settings,
	Sparkles,
	Trophy,
} from "lucide-react";

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

export const sidebarItemsOptions = linkOptions([
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		activeOptions: { exact: true },
	},
	{
		to: "/scheduler",
		label: "Smart Scheduler",
		icon: CalendarDays,
	},
	{
		to: "/subjects",
		label: "Subjects",
		icon: ClipboardList,
	},
	{
		to: "/revision-planner",
		label: "Revision Planner",
		icon: CheckCircle2,
	},
	{
		to: "/performance",
		label: "Performance",
		icon: Trophy,
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: Sparkles,
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
	},
]);
