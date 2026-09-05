import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CalendarDays, Check, Pencil, Plus, Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteButton from "#/components/shared/confirm-delete-button";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import { getProfile } from "#/features/profile/server/profile";
import { getSubjects } from "#/features/subjects/server/subjects";
import {
	filterAndSortTasks,
	type TaskFilter,
	type TaskSort,
} from "#/features/tasks/filtering";
import {
	createTask,
	deleteTask,
	getTasks,
	toggleTask,
	updateTask,
} from "#/features/tasks/server/tasks";

export const Route = createFileRoute("/(private)/_dashboard/tasks/")({
	loader: async () => ({
		tasks: await getTasks(),
		subjects: await getSubjects(),
		profile: await getProfile(),
	}),
	component: TasksPage,
});

function TasksPage() {
	const { tasks, subjects, profile } = Route.useLoaderData();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
	const [taskSort, setTaskSort] = useState<TaskSort>("due-date");
	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
	const [dueDate, setDueDate] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const visibleTasks = filterAndSortTasks(
		tasks.filter(
			(task) =>
				(taskFilter !== "all" ||
					profile.profile?.showCompletedTasks !== false) &&
				`${task.title} ${task.description ?? ""} ${task.subject?.name ?? ""}`
					.toLowerCase()
					.includes(search.toLowerCase()),
		),
		taskFilter,
		taskSort,
	);
	const completedCount = tasks.filter((task) => task.completed).length;

	function resetForm() {
		setFormOpen(false);
		setEditingId(null);
		setTitle("");
		setDescription("");
		setSubjectId("");
		setPriority("MEDIUM");
		setDueDate("");
	}

	function startEdit(task: (typeof tasks)[number]) {
		setEditingId(task.id);
		setFormOpen(true);
		setTitle(task.title);
		setDescription(task.description ?? "");
		setSubjectId(task.subjectId ?? "");
		setPriority(task.priority);
		setDueDate(task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "");
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSaving(true);
		try {
			const data = {
				title,
				description,
				subjectId: subjectId || null,
				priority,
				dueDate: dueDate ? new Date(`${dueDate}T23:59:59`) : null,
			};
			if (editingId) {
				await updateTask({ data: { id: editingId, ...data } });
				toast.success("Task updated");
			} else {
				await createTask({ data });
				toast.success("Task created");
			}
			resetForm();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save task",
			);
		} finally {
			setIsSaving(false);
		}
	}

	async function handleToggle(id: string, completed: boolean) {
		try {
			await toggleTask({ data: { id, completed: !completed } });
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update task",
			);
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteTask({ data: { id } });
			await router.invalidate();
			toast.success("Task deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to delete task",
			);
		}
	}

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Academic Tasks
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">Your tasks</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage your assignments and study goals.
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<div className="relative w-full sm:w-56">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search tasks..."
							className="pl-9"
						/>
					</div>
					<Button
						onClick={() => {
							resetForm();
							setFormOpen(true);
						}}
					>
						<Plus /> Create Task
					</Button>
				</div>
			</section>

			{formOpen && (
				<form
					onSubmit={handleSubmit}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<Input
						required
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Task title"
					/>
					<select
						value={subjectId}
						onChange={(event) => setSubjectId(event.target.value)}
						className="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option value="">No subject</option>
						{subjects.map((subject) => (
							<option key={subject.id} value={subject.id}>
								{subject.name}
							</option>
						))}
					</select>
					<Input
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Description (optional)"
					/>
					<Input
						type="date"
						value={dueDate}
						onChange={(event) => setDueDate(event.target.value)}
					/>
					<select
						value={priority}
						onChange={(event) =>
							setPriority(event.target.value as typeof priority)
						}
						className="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option value="LOW">Low priority</option>
						<option value="MEDIUM">Medium priority</option>
						<option value="HIGH">High priority</option>
					</select>
					<div className="flex gap-2">
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Saving..." : editingId ? "Save Task" : "Add Task"}
						</Button>
						<Button type="button" variant="outline" onClick={resetForm}>
							Cancel
						</Button>
					</div>
				</form>
			)}

			<div className="flex flex-col gap-3 border-y py-3 sm:flex-row sm:items-center sm:justify-between">
				<div
					className="flex flex-wrap gap-1"
					role="group"
					aria-label="Task filters"
				>
					{(
						[
							["all", "All"],
							["due-soon", "Due Soon"],
							["high-priority", "High Priority"],
							["completed", "Completed"],
						] as const
					).map(([value, label]) => (
						<Button
							key={value}
							variant={taskFilter === value ? "secondary" : "ghost"}
							size="sm"
							onClick={() => setTaskFilter(value)}
						>
							{label}
						</Button>
					))}
				</div>
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<span>
						{completedCount} of {tasks.length} completed
					</span>
					<label className="flex items-center gap-2">
						<span className="sr-only">Sort tasks</span>
						<select
							value={taskSort}
							onChange={(event) => setTaskSort(event.target.value as TaskSort)}
							className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
						>
							<option value="due-date">Due date</option>
							<option value="priority">Priority</option>
							<option value="created-date">Creation date</option>
						</select>
					</label>
					<span>{visibleTasks.length} shown</span>
				</div>
			</div>
			<Progress
				value={tasks.length ? (completedCount / tasks.length) * 100 : 0}
				className="h-1.5"
			/>

			<section className="grid gap-4 sm:grid-cols-2">
				{visibleTasks.map((task) => (
					<Card
						key={task.id}
						className={`rounded-xl border bg-card py-0 shadow-sm ${task.completed ? "opacity-70" : ""}`}
					>
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								<button
									type="button"
									onClick={() => handleToggle(task.id, task.completed)}
									className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${task.completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
									aria-label={`${task.completed ? "Reopen" : "Complete"} ${task.title}`}
								>
									{task.completed && <Check className="size-3" />}
								</button>
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<Badge variant="secondary">
											{task.subject?.name ?? "General"}
										</Badge>
										<Badge
											variant={
												task.priority === "HIGH" ? "destructive" : "outline"
											}
										>
											{task.priority}
										</Badge>
									</div>
									<h2
										className={`mt-3 text-sm font-bold ${task.completed ? "line-through" : ""}`}
									>
										{task.title}
									</h2>
									<p className="mt-1 text-xs leading-5 text-muted-foreground">
										{task.description || "No description"}
									</p>
								</div>
								<div className="flex gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => startEdit(task)}
										aria-label={`Edit ${task.title}`}
									>
										<Pencil />
									</Button>
									<ConfirmDeleteButton
										itemLabel={task.title}
										onConfirm={() => handleDelete(task.id)}
									/>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
								{task.dueDate && (
									<>
										<CalendarDays className="size-3.5" />
										Due {task.dueDate.toLocaleDateString()}
									</>
								)}
							</div>
						</CardContent>
					</Card>
				))}
				{visibleTasks.length === 0 && (
					<p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
						No tasks found.
					</p>
				)}
			</section>
		</div>
	);
}
