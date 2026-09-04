import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PROGRAMS } from "../constants";

interface OnboardingSummaryProps {
	programName: string;
	semesterNumber: number;
	name: string;
	theme: string;
	courseCount: number;
	onComplete: () => void;
	isLoading?: boolean;
}

export function OnboardingSummary({
	programName,
	semesterNumber,
	name,
	theme,
	courseCount,
	onComplete,
	isLoading = false,
}: OnboardingSummaryProps) {
	const program = PROGRAMS.find((p) => p.name === programName);

	return (
		<div className="w-full space-y-6">
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
						<CheckCircle2 className="h-12 w-12 text-emerald-600" />
					</div>
				</div>
				<div>
					<h2 className="text-3xl font-bold">You're All Set!</h2>
					<p className="text-muted-foreground mt-2">
						Your study profile has been created successfully
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<Card>
					<CardContent className="pt-6 space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between pb-3 border-b">
								<span className="text-muted-foreground">Program</span>
								<span className="font-semibold">{programName}</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b">
								<span className="text-muted-foreground">Semester</span>
								<span className="font-semibold">
									{semesterNumber}
									{getSemesterSuffix(semesterNumber)} Semester
								</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b">
								<span className="text-muted-foreground">Courses</span>
								<span className="font-semibold">{courseCount}</span>
							</div>
							<div className="flex items-center justify-between pb-3 border-b">
								<span className="text-muted-foreground">Your Name</span>
								<span className="font-semibold">{name}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Theme</span>
								<span className="font-semibold capitalize">{theme}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
					<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
						What's Next?
					</h3>
					<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
						<li>✓ Create your study plans and set goals</li>
						<li>✓ Add subjects and track your progress</li>
						<li>✓ Schedule study sessions and exams</li>
						<li>✓ Use analytics to improve your performance</li>
					</ul>
				</div>
			</div>

			<Button
				onClick={onComplete}
				className="w-full"
				disabled={isLoading}
				size="lg"
			>
				{isLoading ? "Setting up..." : "Go to Dashboard"}
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	);
}

function getSemesterSuffix(n: number): string {
	if (n % 10 === 1 && n !== 11) return "st";
	if (n % 10 === 2 && n !== 12) return "nd";
	if (n % 10 === 3 && n !== 13) return "rd";
	return "th";
}
