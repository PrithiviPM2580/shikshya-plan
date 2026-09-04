import { useForm } from "@tanstack/react-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROGRAMS } from "../constants";
import { SemesterSelectionSchema } from "../schemas";

interface SemesterSelectionProps {
	programName: string;
	selectedSemester: number | null;
	onSelectSemester: (semesterNumber: number) => void;
	onNext: () => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function SemesterSelection({
	programName,
	selectedSemester,
	onSelectSemester,
	onNext,
	onBack,
	isLoading = false,
}: SemesterSelectionProps) {
	const program = PROGRAMS.find((p) => p.name === programName);

	const form = useForm({
		defaultValues: {
			semesterNumber: selectedSemester || 1,
		},
		validators: {
			onSubmit: SemesterSelectionSchema,
		},
		onSubmit: async ({ value }) => {
			onSelectSemester(value.semesterNumber);
			onNext();
		},
	});

	if (!program) {
		return <div>Program not found</div>;
	}

	const semesters = program.semesters;

	return (
		<div className="w-full space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Select Your Current Semester</h2>
				<p className="text-sm text-muted-foreground mt-2">
					You're enrolled in <strong>{programName}</strong>. Which semester are
					you currently in?
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
					{semesters.map((semester, index) => (
						<form.Field
							key={semester.semester}
							name="semesterNumber"
							children={(field) => (
								<Card
									className="cursor-pointer transition-all hover:border-primary/50"
									onClick={() => field.handleChange(index + 1)}
									data-selected={
										field.state.value === index + 1 ? "true" : "false"
									}
								>
									<CardHeader className="p-4">
										<CardTitle className="text-center text-lg">
											{semester.semester}
										</CardTitle>
									</CardHeader>
									{field.state.value === index + 1 && (
										<CardContent className="p-4 pt-0">
											<div className="flex justify-center">
												<div className="rounded-full bg-primary p-1">
													<Check className="h-4 w-4 text-white" />
												</div>
											</div>
										</CardContent>
									)}
								</Card>
							)}
						/>
					))}
				</div>

				<div className="flex gap-3">
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={onBack}
					>
						Back
					</Button>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading || !form.state.values.semesterNumber}
					>
						{isLoading ? "Loading..." : "Continue"}
					</Button>
				</div>
			</form>
		</div>
	);
}
