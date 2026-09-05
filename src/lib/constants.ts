import { linkOptions } from "@tanstack/react-router";
import {
	BookOpen,
	Brain,
	Calendar,
	CheckSquare,
	ClipboardCheck,
	GraduationCap,
	LayoutDashboard,
	ListTodo,
	Settings,
	Target,
	Timer,
	TrendingUp,
	User,
} from "lucide-react";

export const AI_MODELS = [
	"inclusionai/ling-3.0-flash-sante:free",
	"inclusionai/ling-3.0-flash-fin:free",
	"dots-studio/dots-3-note-preview:free",
	"liquid/lfm-2.5-2.6b:free",
	"nvidia/nemotron-3.5-lightning:free",
	"thinkingmachines/inkling-small:free",
	"poolside/laguna-s-2.1:free",
	"cohere/north-mini-code:free",
	"nvidia/nemotron-3.5-content-safety:free",
	"nvidia/nemotron-3-ultra-550b-a55b:free",
	"minimax/minimax-m3:free",
	"google/gemma-4-26b-a4b-it:free",
	"google/gemma-4-31b-it:free",
	"nvidia/nemotron-3-super-120b-a12b:free",
] as const;

export const DEFAULT_AI_MODEL = "google/gemma-4-31b-it:free";

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
		to: "/ai",
		label: "AI Study Coach",
		icon: Brain,
	},
	{
		to: "/exams",
		label: "Exams",
		icon: ClipboardCheck,
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

export const studyLevels = [
	{
		id: "bca",
		short: "BC",
		label: "BCA",
		subtitle: "Bachelor of Computer Applications",
	},
	{
		id: "csit",
		short: "C",
		label: "CSIT",
		subtitle:
			" Bachelor of Science in Computer Science and Information Technology",
	},
	{
		id: "bit",
		short: "BI",
		label: "BIT",
		subtitle: "Bachelor of Information Technology",
	},
	{
		id: "other",
		short: "...",
		label: "Other",
		subtitle: "Masters, Diploma, etc.",
	},
] as const;
