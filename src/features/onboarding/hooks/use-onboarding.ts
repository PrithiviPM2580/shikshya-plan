"use client";

import { useCallback, useState } from "react";
import type { Course, OnboardingStepId } from "../types";

export interface OnboardingState {
	currentStep: OnboardingStepId;
	programName: string;
	semesterNumber: number | null;
	courses: Course[];
	profile: {
		name: string;
		theme: "SYSTEM" | "LIGHT" | "DARK";
	};
}

const INITIAL_STATE: OnboardingState = {
	currentStep: "program",
	programName: "",
	semesterNumber: null,
	courses: [],
	profile: {
		name: "",
		theme: "SYSTEM",
	},
};

export function useOnboarding() {
	const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

	const goToStep = useCallback((step: OnboardingStepId) => {
		setState((prev) => ({ ...prev, currentStep: step }));
	}, []);

	const nextStep = useCallback(() => {
		const steps: OnboardingStepId[] = [
			"program",
			"semester",
			"review",
			"profile",
			"summary",
		];
		const currentIndex = steps.indexOf(state.currentStep);
		if (currentIndex < steps.length - 1) {
			setState((prev) => ({ ...prev, currentStep: steps[currentIndex + 1] }));
		}
	}, [state.currentStep]);

	const previousStep = useCallback(() => {
		const steps: OnboardingStepId[] = [
			"program",
			"semester",
			"review",
			"profile",
			"summary",
		];
		const currentIndex = steps.indexOf(state.currentStep);
		if (currentIndex > 0) {
			setState((prev) => ({ ...prev, currentStep: steps[currentIndex - 1] }));
		}
	}, [state.currentStep]);

	const setProgramName = useCallback((programName: string) => {
		setState((prev) => ({ ...prev, programName }));
	}, []);

	const setSemesterNumber = useCallback((semesterNumber: number) => {
		setState((prev) => ({ ...prev, semesterNumber }));
	}, []);

	const setCourses = useCallback((courses: Course[]) => {
		setState((prev) => ({ ...prev, courses }));
	}, []);

	const setProfile = useCallback(
		(profile: Partial<OnboardingState["profile"]>) => {
			setState((prev) => ({
				...prev,
				profile: { ...prev.profile, ...profile },
			}));
		},
		[],
	);

	const reset = useCallback(() => {
		setState(INITIAL_STATE);
	}, []);

	return {
		state,
		goToStep,
		nextStep,
		previousStep,
		setProgramName,
		setSemesterNumber,
		setCourses,
		setProfile,
		reset,
	};
}
