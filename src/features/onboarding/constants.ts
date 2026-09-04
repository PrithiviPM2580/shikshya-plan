import academicPrograms from "#/data/academic-programs.json";

export const PROGRAMS = academicPrograms.programs;

export const ONBOARDING_STEPS = [
	{
		id: 1,
		key: "program",
		title: "Choose Your Program",
		description: "Select your academic program",
	},
	{
		id: 2,
		key: "semester",
		title: "Select Semester",
		description: "Choose your current semester",
	},
	{
		id: 3,
		key: "review",
		title: "Review Courses",
		description: "Check your courses and plan",
	},
	{
		id: 4,
		key: "profile",
		title: "Your Profile",
		description: "Set up your profile",
	},
	{
		id: 5,
		key: "summary",
		title: "All Set!",
		description: "You're ready to start",
	},
] as const;

export const THEME_OPTIONS = [
	{ value: "SYSTEM", label: "System" },
	{ value: "LIGHT", label: "Light" },
	{ value: "DARK", label: "Dark" },
] as const;
