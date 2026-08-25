import { linkOptions } from "@tanstack/react-router";
import {
	BookOpen,
	Calendar,
	CheckSquare,
	GraduationCap,
	LayoutDashboard,
	ListTodo,
	Settings,
	Target,
	Timer,
	TrendingUp,
	User,
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

export const primarySidebarItems = linkOptions([
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		activeOptions: { exact: true },
	},
	{
		to: "/subjects",
		label: "Subjects",
		icon: BookOpen,
	},
	{
		to: "/plans",
		label: "Study Plans",
		icon: ListTodo,
	},
	{
		to: "/sessions",
		label: "Sessions",
		icon: GraduationCap,
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: CheckSquare,
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: Calendar,
	},
]);

export const secondarySidebarItems = linkOptions([
	{
		to: "/exams",
		label: "Exams",
		icon: GraduationCap,
	},
	{
		to: "/goals",
		label: "Goals",
		icon: Target,
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: TrendingUp,
	},
	{
		to: "/pomodoro",
		label: "Pomodoro",
		icon: Timer,
	},
]);

export const metaSidebarItems = linkOptions([
	{
		to: "/profile",
		label: "Profile",
		icon: User,
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
	},
]);
