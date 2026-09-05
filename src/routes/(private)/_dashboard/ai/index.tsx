import { createFileRoute } from "@tanstack/react-router";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	generateStudyPlan,
	saveGeneratedStudyPlan,
} from "#/features/ai/server/study-plan";
import type { GeneratedStudyPlan } from "#/features/ai/validation";
import { getSubjects } from "#/features/subjects/server/subjects";

export const Route = createFileRoute("/(private)/_dashboard/ai/")({
	loader: () => getSubjects(),
	component: AiPage,
});

function AiPage() {
	const subjects = Route.useLoaderData();
	const [focus, setFocus] = useState("");
	const [days, setDays] = useState("7");
	const [plan, setPlan] = useState<GeneratedStudyPlan | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [subjectId, setSubjectId] = useState("");
	const [selectedTaskKeys, setSelectedTaskKeys] = useState<string[]>([]);

	async function createPlan(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		try {
			const result = await generateStudyPlan({
				data: { focus, days: Number(days) },
			});
			setPlan(result);
			setSelectedTaskKeys(
				result.days.flatMap((day, dayIndex) =>
					day.tasks.map((_, taskIndex) => `${dayIndex}-${taskIndex}`),
				),
			);
			toast.success("AI study plan generated");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to generate a study plan",
			);
		} finally {
			setLoading(false);
		}
	}

	function taskKey(dayIndex: number, taskIndex: number) {
		return `${dayIndex}-${taskIndex}`;
	}

	function toggleTask(key: string) {
		setSelectedTaskKeys((current) =>
			current.includes(key)
				? current.filter((item) => item !== key)
				: [...current, key],
		);
	}

	async function saveTasks() {
		if (!plan || selectedTaskKeys.length === 0) {
			toast.error("Select at least one task to save");
			return;
		}
		setSaving(true);
		try {
			const result = await saveGeneratedStudyPlan({
				data: {
					plan,
					selectedTaskKeys,
					subjectId: subjectId || null,
				},
			});
			toast.success(
				`${result.count} task${result.count === 1 ? "" : "s"} saved`,
			);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save tasks",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="w-full space-y-5">
			<section className="border-b border-border pb-5">
				<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					<Sparkles className="size-3.5" /> AI study coach
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight">
					Build a focused study plan
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Generate a practical schedule from your subjects, profile, and
					upcoming exams.
				</p>
			</section>

			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardContent className="p-5">
					<form
						onSubmit={createPlan}
						className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-end"
					>
						<label className="space-y-2 text-sm font-medium">
							What should the plan focus on?
							<Input
								value={focus}
								onChange={(event) => setFocus(event.target.value)}
								placeholder="e.g. Prepare for my nearest exam"
							/>
						</label>
						<label className="space-y-2 text-sm font-medium">
							Plan length
							<select
								value={days}
								onChange={(event) => setDays(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
							>
								<option value="3">3 days</option>
								<option value="5">5 days</option>
								<option value="7">7 days</option>
							</select>
						</label>
						<Button type="submit" disabled={loading}>
							{loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
							{loading ? "Planning..." : "Generate plan"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{plan ? (
				<section className="space-y-4">
					<Card className="rounded-xl border bg-primary text-primary-foreground py-0 shadow-sm">
						<CardContent className="p-5">
							<div className="flex items-center gap-2">
								<Brain className="size-5" />
								<Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20">
									AI generated
								</Badge>
							</div>
							<h2 className="mt-4 text-xl font-bold">{plan.title}</h2>
							<p className="mt-1 text-sm text-primary-foreground/80">
								{plan.overview}
							</p>
						</CardContent>
					</Card>
					<div>
						<h2 className="text-sm font-bold">Generated schedule</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							Your overview is above. The daily study tasks are listed below.
						</p>
					</div>
					<div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
						<label className="space-y-2 text-sm font-medium">
							Save tasks under a subject
							<select
								value={subjectId}
								onChange={(event) => setSubjectId(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
							>
								<option value="">No subject</option>
								{subjects.map((subject) => (
									<option key={subject.id} value={subject.id}>
										{subject.name}
									</option>
								))}
							</select>
						</label>
						<Button
							onClick={saveTasks}
							disabled={saving || selectedTaskKeys.length === 0}
						>
							{saving ? <Loader2 className="animate-spin" /> : <Sparkles />}
							{saving ? "Saving..." : `Save ${selectedTaskKeys.length} tasks`}
						</Button>
					</div>
					<div className="grid gap-4 lg:grid-cols-2">
						{plan.days.map((day, dayIndex) => (
							<Card
								key={day.day}
								className="rounded-xl border bg-card py-0 shadow-sm"
							>
								<CardHeader className="px-4 pb-2 pt-4">
									<CardTitle className="text-sm">{day.day}</CardTitle>
									<p className="text-xs text-muted-foreground">{day.focus}</p>
								</CardHeader>
								<CardContent className="space-y-2 px-4 pb-4">
									{day.tasks.map((task, taskIndex) => {
										const key = taskKey(dayIndex, taskIndex);
										return (
											<div
												key={task.title}
												className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
											>
												<input
													type="checkbox"
													checked={selectedTaskKeys.includes(key)}
													onChange={() => toggleTask(key)}
													aria-label={`Select ${task.title}`}
												/>
												<div className="min-w-0 flex-1">
													<p className="text-xs font-semibold">{task.title}</p>
													<p className="mt-1 text-[11px] text-muted-foreground">
														{task.durationMinutes} minutes
													</p>
												</div>
												<Badge
													variant={
														task.priority === "HIGH" ? "destructive" : "outline"
													}
												>
													{task.priority}
												</Badge>
											</div>
										);
									})}
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			) : (
				<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					Your generated plan will appear here.
				</div>
			)}
		</div>
	);
}
