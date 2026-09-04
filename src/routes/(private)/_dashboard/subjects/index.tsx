import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	BookOpen,
	CheckCircle2,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import {
	createSubject,
	deleteSubject,
	getSubjects,
	updateSubject,
} from "#/features/subjects/server/subjects";

export const Route = createFileRoute("/(private)/_dashboard/subjects/")({
	loader: () => getSubjects(),
	component: SubjectsPage,
});

function SubjectsPage() {
	const subjects = Route.useLoaderData();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const visibleSubjects = subjects.filter((subject) =>
		`${subject.name} ${subject.description ?? ""}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	function resetForm() {
		setName("");
		setDescription("");
		setEditingId(null);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSaving(true);
		try {
			if (editingId) {
				await updateSubject({
					data: { id: editingId, name, description, color: "#4F46E5" },
				});
				toast.success("Subject updated");
			} else {
				await createSubject({ data: { name, description, color: "#4F46E5" } });
				toast.success("Subject added");
			}
			resetForm();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save subject",
			);
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteSubject({ data: { id } });
			await router.invalidate();
			toast.success("Subject removed");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to remove subject",
			);
		}
	}

	return (
		<div className="w-full space-y-6">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Library
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Your Subjects
					</h1>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setEditingId("");
					}}
				>
					<Plus /> New Subject
				</Button>
			</section>

			{editingId !== null && (
				<form
					onSubmit={handleSubmit}
					className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto_auto]"
				>
					<Input
						required
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder="Subject name"
					/>
					<Input
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Description (optional)"
					/>
					<Button type="submit" disabled={isSaving}>
						{isSaving ? "Saving..." : editingId ? "Save" : "Add"}
					</Button>
					<Button type="button" variant="outline" onClick={resetForm}>
						Cancel
					</Button>
				</form>
			)}

			<div className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search subjects..."
					className="pl-9"
				/>
			</div>

			<div className="text-sm text-muted-foreground">
				Showing{" "}
				<strong className="text-foreground">{visibleSubjects.length}</strong>{" "}
				subjects
			</div>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{visibleSubjects.map((subject) => (
					<Card
						key={subject.id}
						className="rounded-xl border bg-card py-0 shadow-sm"
					>
						<CardContent className="flex h-full flex-col p-4">
							<div className="flex items-start justify-between">
								<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<BookOpen className="size-5" />
								</div>
								<div className="flex gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label={`Edit ${subject.name}`}
										onClick={() => {
											setEditingId(subject.id);
											setName(subject.name);
											setDescription(subject.description ?? "");
										}}
									>
										<Pencil />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label={`Delete ${subject.name}`}
										onClick={() => handleDelete(subject.id)}
									>
										<Trash2 />
									</Button>
								</div>
							</div>
							<div className="mt-4 min-h-14">
								<h2 className="text-sm font-bold">{subject.name}</h2>
								<p className="mt-1 text-xs text-muted-foreground">
									{subject.description || "No description yet"}
								</p>
							</div>
							<div className="mt-4 grid grid-cols-2 gap-2">
								<div className="rounded-lg bg-muted/60 px-3 py-2">
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<CheckCircle2 className="size-3.5" />
										<span className="text-[11px]">Tasks</span>
									</div>
									<p className="mt-1 text-sm font-bold">
										{subject._count.tasks}
									</p>
								</div>
								<div className="rounded-lg bg-muted/60 px-3 py-2">
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<BookOpen className="size-3.5" />
										<span className="text-[11px]">Exams</span>
									</div>
									<p className="mt-1 text-sm font-bold">
										{subject._count.exams}
									</p>
								</div>
							</div>
							<div className="mt-auto pt-5">
								<div className="mb-2 flex justify-between text-xs">
									<span className="text-muted-foreground">
										Syllabus mastery
									</span>
									<span className="font-bold text-primary">0%</span>
								</div>
								<Progress value={0} className="h-1.5" />
							</div>
						</CardContent>
					</Card>
				))}
			</section>
		</div>
	);
}
