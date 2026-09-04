import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Check, Pencil, Plus, Target, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import {
	createGoal,
	deleteGoal,
	getGoals,
	setGoalProgress,
	updateGoal,
} from "#/features/goals/server/goals";

export const Route = createFileRoute("/(private)/_dashboard/goals/")({
	loader: () => getGoals(),
	component: GoalsPage,
});

function GoalsPage() {
	const goals = Route.useLoaderData();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [target, setTarget] = useState(100);
	const [progress, setProgress] = useState(0);
	const [deadline, setDeadline] = useState("");
	const [saving, setSaving] = useState(false);
	const active = goals.filter((goal) => !goal.completed);
	const achieved = goals.filter((goal) => goal.completed);
	const focus = active[0];
	const focusPercentage = focus
		? Math.min(100, Math.round((focus.progress / focus.target) * 100))
		: 0;

	function reset() {
		setOpen(false);
		setEditingId(null);
		setTitle("");
		setTarget(100);
		setProgress(0);
		setDeadline("");
	}
	function edit(goal: (typeof goals)[number]) {
		setOpen(true);
		setEditingId(goal.id);
		setTitle(goal.title);
		setTarget(goal.target);
		setProgress(goal.progress);
		setDeadline(
			goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : "",
		);
	}
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			const data = {
				title,
				target,
				progress,
				deadline: deadline ? new Date(`${deadline}T23:59:59`) : null,
			};
			if (editingId) {
				await updateGoal({ data: { id: editingId, ...data } });
				toast.success("Goal updated");
			} else {
				await createGoal({ data });
				toast.success("Goal created");
			}
			reset();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save goal",
			);
		} finally {
			setSaving(false);
		}
	}
	async function changeProgress(id: string, value: number) {
		try {
			await setGoalProgress({ data: { id, progress: value } });
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update progress",
			);
		}
	}
	async function remove(id: string) {
		try {
			await deleteGoal({ data: { id } });
			await router.invalidate();
			toast.success("Goal deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to delete goal",
			);
		}
	}

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 rounded-xl bg-muted/50 p-5 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Your ambitions
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Goals that move you forward
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Set measurable targets and track your progress.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2 text-center">
					<div className="rounded-lg bg-background px-5 py-3">
						<p className="text-lg font-bold">{active.length}</p>
						<p className="text-[10px] uppercase text-muted-foreground">
							Active goals
						</p>
					</div>
					<div className="rounded-lg bg-primary/10 px-5 py-3">
						<p className="text-lg font-bold text-primary">{achieved.length}</p>
						<p className="text-[10px] uppercase text-primary">Achieved</p>
					</div>
				</div>
			</section>
			{focus && (
				<Card className="rounded-xl border-0 bg-primary text-primary-foreground shadow-sm">
					<CardContent className="p-5">
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/75">
							Current focus
						</p>
						<h2 className="mt-2 text-base font-bold">{focus.title}</h2>
						<div className="mt-4 flex items-center gap-3">
							<Progress
								value={focusPercentage}
								className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
							/>
							<span className="text-xs">{focusPercentage}%</span>
						</div>
					</CardContent>
				</Card>
			)}
			<section className="flex justify-end">
				<Button
					onClick={() => {
						reset();
						setOpen(true);
					}}
				>
					<Plus /> New Goal
				</Button>
			</section>
			{open && (
				<form
					onSubmit={submit}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Goal title</span>
						<Input
							required
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Target value</span>
						<Input
							required
							type="number"
							min="1"
							value={target}
							onChange={(event) => setTarget(Number(event.target.value))}
						/>
						<span className="text-xs text-muted-foreground">
							The total you want to reach.
						</span>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Current progress</span>
						<Input
							type="number"
							min="0"
							max={target}
							value={progress}
							onChange={(event) => setProgress(Number(event.target.value))}
						/>
						<span className="text-xs text-muted-foreground">
							Must be between 0 and the target.
						</span>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Deadline</span>
						<Input
							type="date"
							value={deadline}
							onChange={(event) => setDeadline(event.target.value)}
						/>
					</label>
					<div className="flex gap-2">
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : editingId ? "Save Goal" : "Create Goal"}
						</Button>
						<Button type="button" variant="outline" onClick={reset}>
							Cancel
						</Button>
					</div>
				</form>
			)}
			<section className="grid gap-4 md:grid-cols-2">
				{goals.map((goal) => {
					const percentage = Math.min(
						100,
						Math.round((goal.progress / goal.target) * 100),
					);
					return (
						<Card
							key={goal.id}
							className={`rounded-xl border bg-card py-0 shadow-sm ${goal.completed ? "opacity-70" : ""}`}
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between gap-3">
									<Badge variant={goal.completed ? "secondary" : "outline"}>
										{goal.completed ? "Achieved" : "Active"}
									</Badge>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => edit(goal)}
											aria-label={`Edit ${goal.title}`}
										>
											<Pencil />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => remove(goal.id)}
											aria-label={`Delete ${goal.title}`}
										>
											<Trash2 />
										</Button>
									</div>
								</div>
								<h2
									className={`mt-3 text-sm font-bold ${goal.completed ? "line-through" : ""}`}
								>
									{goal.title}
								</h2>
								<div className="mt-4 flex items-center justify-between text-xs">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-semibold text-primary">
										{goal.progress} / {goal.target} ({percentage}%)
									</span>
								</div>
								<Progress value={percentage} className="mt-2 h-1.5" />
								<div className="mt-3 flex items-center gap-2">
									<Target className="size-3.5 text-muted-foreground" />
									{goal.deadline ? (
										<span className="text-xs text-muted-foreground">
											Due {new Date(goal.deadline).toLocaleDateString()}
										</span>
									) : (
										<span className="text-xs text-muted-foreground">
											No deadline
										</span>
									)}
								</div>
								{!goal.completed && (
									<div className="mt-4 flex items-center gap-2">
										<Input
											type="number"
											min="0"
											max={goal.target}
											defaultValue={goal.progress}
											className="h-8"
											aria-label={`Progress for ${goal.title}`}
											onKeyDown={(event) => {
												if (event.key === "Enter") {
													event.preventDefault();
													changeProgress(
														goal.id,
														Number(event.currentTarget.value),
													);
												}
											}}
										/>
										<Button
											size="sm"
											variant="outline"
											onClick={(event) => {
												const input = event.currentTarget
													.previousElementSibling as HTMLInputElement;
												changeProgress(goal.id, Number(input.value));
											}}
										>
											Update
										</Button>
									</div>
								)}
								{goal.completed && (
									<p className="mt-4 flex items-center gap-1 text-xs text-primary">
										<Check className="size-3.5" /> Goal completed
									</p>
								)}
							</CardContent>
						</Card>
					);
				})}
				{goals.length === 0 && (
					<p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
						No goals created yet.
					</p>
				)}
			</section>
		</div>
	);
}
