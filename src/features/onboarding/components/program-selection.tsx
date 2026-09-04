import { useForm } from "@tanstack/react-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PROGRAMS } from "../constants";
import { ProgramSelectionSchema } from "../schemas";

interface ProgramSelectionProps {
	selectedProgram: string;
	onSelectProgram: (programName: string) => void;
	onNext: () => void;
	isLoading?: boolean;
}

export function ProgramSelection({
	selectedProgram,
	onSelectProgram,
	onNext,
	isLoading = false,
}: ProgramSelectionProps) {
	const form = useForm({
		defaultValues: {
			programName: selectedProgram,
		},
		validators: {
			onSubmit: ProgramSelectionSchema,
		},
		onSubmit: async ({ value }) => {
			onSelectProgram(value.programName);
			onNext();
		},
	});

	return (
		<div className="w-full space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Choose Your Academic Program</h2>
				<p className="text-sm text-muted-foreground mt-2">
					Select the program you're currently pursuing
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div className="grid gap-4 md:grid-cols-2">
					{PROGRAMS.map((program) => (
						<form.Field
							key={program.name}
							name="programName"
							children={(field) => (
								<Card
									className="cursor-pointer transition-all hover:border-primary/50"
									onClick={() => field.handleChange(program.name)}
									data-selected={
										field.state.value === program.name ? "true" : "false"
									}
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle className="text-lg">
													{program.name}
												</CardTitle>
												<CardDescription className="mt-1">
													{program.label}
												</CardDescription>
											</div>
											{field.state.value === program.name && (
												<div className="rounded-full bg-primary p-1">
													<Check className="h-4 w-4 text-white" />
												</div>
											)}
										</div>
									</CardHeader>
									<CardContent className="text-sm">
										<dl className="space-y-2">
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Duration:</dt>
												<dd className="font-medium">{program.duration}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Semesters:</dt>
												<dd className="font-medium">
													{program.total_semesters}
												</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Credits:</dt>
												<dd className="font-medium">{program.total_credits}</dd>
											</div>
										</dl>
									</CardContent>
								</Card>
							)}
						/>
					))}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading || !form.state.values.programName}
				>
					{isLoading ? "Loading..." : "Continue"}
				</Button>
			</form>
		</div>
	);
}
