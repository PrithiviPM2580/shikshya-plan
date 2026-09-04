import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Archive, BookOpen, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import {
	createPlan,
	deletePlan,
	getPlans,
	updatePlan,
	updatePlanStatus,
} from "#/features/plans/server/plans";
import { getSubjects } from "#/features/subjects/server/subjects";

export const Route = createFileRoute("/(private)/_dashboard/plans/")({
	loader: async () => ({
		plans: await getPlans(),
		subjects: await getSubjects(),
	}),
	component: PlansPage,
});

function PlansPage() {
	const { plans, subjects } = Route.useLoaderData();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [goal, setGoal] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [subjectIds, setSubjectIds] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	function reset() {
		setOpen(false);
		setEditingId(null);
		setTitle("");
		setDescription("");
		setGoal("");
		setStartDate("");
		setEndDate("");
		setSubjectIds([]);
	}
	function edit(plan: (typeof plans)[number]) {
		setOpen(true);
		setEditingId(plan.id);
		setTitle(plan.title);
		setDescription(plan.description ?? "");
		setGoal(plan.goal ?? "");
		setStartDate(
			plan.startDate ? new Date(plan.startDate).toISOString().slice(0, 10) : "",
		);
		setEndDate(
			plan.endDate ? new Date(plan.endDate).toISOString().slice(0, 10) : "",
		);
		setSubjectIds(plan.subjects.map(({ subject }) => subject.id));
	}
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			const data = {
				title,
				description,
				goal,
				startDate: startDate ? new Date(`${startDate}T00:00:00`) : null,
				endDate: endDate ? new Date(`${endDate}T23:59:59`) : null,
				subjectIds,
			};
			if (editingId) {
				await updatePlan({ data: { id: editingId, ...data } });
				toast.success("Plan updated");
			} else {
				await createPlan({ data });
				toast.success("Plan created");
			}
			reset();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save plan",
			);
		} finally {
			setSaving(false);
		}
	}
	async function status(
		id: string,
		value: "ACTIVE" | "COMPLETED" | "ARCHIVED",
	) {
		try {
			await updatePlanStatus({ data: { id, status: value } });
			await router.invalidate();
			toast.success(`Plan marked ${value.toLowerCase()}`);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update plan",
			);
		}
	}
	async function remove(id: string) {
		try {
			await deletePlan({ data: { id } });
			await router.invalidate();
			toast.success("Plan deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to delete plan",
			);
		}
	}
	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Study Plans
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Your study plans
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Design and track your academic sprints.
					</p>
				</div>
				<Button
					onClick={() => {
						reset();
						setOpen(true);
					}}
				>
					<Plus /> Create New Plan
				</Button>
			</section>
			{open && (
				<form
					onSubmit={submit}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<label className="space-y-1 text-sm md:col-span-2">
						<span className="font-medium">Plan name</span>
						<Input
							required
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Description</span>
						<Input
							value={description}
							onChange={(event) => setDescription(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Goal</span>
						<Input
							value={goal}
							onChange={(event) => setGoal(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Start date</span>
						<Input
							type="date"
							value={startDate}
							onChange={(event) => setStartDate(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">End date</span>
						<Input
							type="date"
							value={endDate}
							onChange={(event) => setEndDate(event.target.value)}
						/>
					</label>
					<fieldset className="space-y-2 md:col-span-2">
						<legend className="text-sm font-medium">Subjects</legend>
						<div className="grid gap-2 sm:grid-cols-2">
							{subjects.map((subject) => (
								<label
									key={subject.id}
									className="flex items-center gap-2 text-sm"
								>
									<input
										type="checkbox"
										checked={subjectIds.includes(subject.id)}
										onChange={() =>
											setSubjectIds((current) =>
												current.includes(subject.id)
													? current.filter((id) => id !== subject.id)
													: [...current, subject.id],
											)
										}
									/>
									{subject.name}
								</label>
							))}
						</div>
					</fieldset>
					<div className="flex gap-2">
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : editingId ? "Save Plan" : "Create Plan"}
						</Button>
						<Button type="button" variant="outline" onClick={reset}>
							Cancel
						</Button>
					</div>
				</form>
			)}
			<section className="grid gap-4 md:grid-cols-2">
				{plans.map((plan) => {
					const taskStates = plan.subjects.flatMap(
						({ subject }) => subject.tasks,
					);
					const completed = taskStates.filter((task) => task.completed).length;
					const percentage = taskStates.length
						? Math.round((completed / taskStates.length) * 100)
						: 0;
					return (
						<Card
							key={plan.id}
							className="rounded-xl border bg-card py-0 shadow-sm"
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between gap-3">
									<Badge
										variant={plan.status === "ACTIVE" ? "default" : "secondary"}
									>
										{plan.status}
									</Badge>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => edit(plan)}
											aria-label={`Edit ${plan.title}`}
										>
											<Pencil />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() =>
												status(
													plan.id,
													plan.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED",
												)
											}
											aria-label={`Archive ${plan.title}`}
										>
											<Archive />
										</Button>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => remove(plan.id)}
											aria-label={`Delete ${plan.title}`}
										>
											<Trash2 />
										</Button>
									</div>
								</div>
								<h2 className="mt-3 text-sm font-bold">{plan.title}</h2>
								<p className="mt-1 text-xs text-muted-foreground">
									{plan.description || "No description"}
								</p>
								<div className="mt-4 flex items-center justify-between text-xs">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-semibold text-primary">
										{percentage}%
									</span>
								</div>
								<Progress value={percentage} className="mt-2 h-1.5" />
								<div className="mt-4 flex flex-wrap gap-2">
									{plan.subjects.map(({ subject }) => (
										<Badge key={subject.id} variant="outline">
											<BookOpen className="mr-1 size-3" />
											{subject.name}
										</Badge>
									))}
								</div>
								<div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
									<span>
										{plan.startDate
											? new Date(plan.startDate).toLocaleDateString()
											: "No start date"}{" "}
										{plan.endDate
											? `- ${new Date(plan.endDate).toLocaleDateString()}`
											: ""}
									</span>
									{plan.status === "ACTIVE" && (
										<Button
											variant="link"
											size="sm"
											className="h-auto p-0"
											onClick={() => status(plan.id, "COMPLETED")}
										>
											<Check className="size-3" /> Complete
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}
				{plans.length === 0 && (
					<p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
						No study plans yet.
					</p>
				)}
			</section>
		</div>
	);
}
