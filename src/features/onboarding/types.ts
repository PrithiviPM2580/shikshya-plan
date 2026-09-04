export interface Program {
	name: string;
	label: string;
	university: string;
	curriculum: string;
	duration: string;
	total_semesters: number;
	total_credits: number;
}

export interface Course {
	code: string;
	name: string;
	credits: number;
	type: "core" | "elective" | "project" | "workshop" | "internship";
	has_practical: boolean;
	has_exam: boolean;
	elective_options?: string[];
}

export interface Semester {
	semester: string;
	courses: Course[];
}

export interface OnboardingData {
	programName: string;
	selectedSemester: number;
	courses: Course[];
}

export interface OnboardingStep {
	id: number;
	title: string;
	description: string;
}

export type OnboardingStepId =
	| "program"
	| "semester"
	| "review"
	| "profile"
	| "summary";
