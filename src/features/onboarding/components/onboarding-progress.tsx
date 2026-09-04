import { CheckCircle2, Circle } from "lucide-react";

interface OnboardingProgressProps {
	steps: Array<{
		id: number;
		key: string;
		title: string;
	}>;
	currentStepKey: string;
}

export function OnboardingProgress({
	steps,
	currentStepKey,
}: OnboardingProgressProps) {
	const currentStepIndex = steps.findIndex((s) => s.key === currentStepKey);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				{steps.map((step, index) => (
					<div key={step.id} className="flex items-center gap-2">
						<div className="flex flex-col items-center">
							<div
								className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
									index < currentStepIndex
										? "bg-emerald-600 border-emerald-600"
										: index === currentStepIndex
											? "bg-primary border-primary"
											: "bg-background border-muted"
								}`}
							>
								{index < currentStepIndex ? (
									<CheckCircle2 className="h-5 w-5 text-white" />
								) : (
									<Circle
										className={`h-5 w-5 ${
											index === currentStepIndex
												? "text-white"
												: "text-muted-foreground"
										}`}
									/>
								)}
							</div>
							<span
								className={`text-xs mt-2 text-center w-20 ${
									index === currentStepIndex
										? "text-foreground font-semibold"
										: "text-muted-foreground"
								}`}
							>
								{step.title}
							</span>
						</div>
						{index < steps.length - 1 && (
							<div
								className={`h-0.5 w-12 ${
									index < currentStepIndex ? "bg-emerald-600" : "bg-muted"
								} transition-all`}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
