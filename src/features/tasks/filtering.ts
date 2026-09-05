export type TaskFilter = "all" | "due-soon" | "high-priority" | "completed";
export type TaskSort = "due-date" | "priority" | "created-date";

type TaskListItem = {
	completed: boolean;
	priority: "LOW" | "MEDIUM" | "HIGH";
	dueDate: Date | null;
	createdAt: Date;
};

type TaskFilterOptions = {
	now?: Date;
	showCompletedTasks?: boolean;
};

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;

export function filterAndSortTasks<T extends TaskListItem>(
	tasks: readonly T[],
	filter: TaskFilter,
	sort: TaskSort,
	options: TaskFilterOptions = {},
): T[] {
	const now = options.now ?? new Date();
	const showCompletedTasks = options.showCompletedTasks ?? true;
	const dueSoonEnd = new Date(now);
	dueSoonEnd.setDate(dueSoonEnd.getDate() + 7);

	return [...tasks]
		.filter((task) => {
			if (task.completed && filter !== "completed" && !showCompletedTasks) {
				return false;
			}

			switch (filter) {
				case "due-soon":
					return (
						!task.completed &&
						task.dueDate !== null &&
						task.dueDate >= now &&
						task.dueDate <= dueSoonEnd
					);
				case "high-priority":
					return task.priority === "HIGH" && !task.completed;
				case "completed":
					return task.completed;
				default:
					return true;
			}
		})
		.sort((left, right) => {
			switch (sort) {
				case "priority":
					return priorityRank[left.priority] - priorityRank[right.priority];
				case "created-date":
					return right.createdAt.getTime() - left.createdAt.getTime();
				default:
					if (left.dueDate === null) return 1;
					if (right.dueDate === null) return -1;
					return left.dueDate.getTime() - right.dueDate.getTime();
			}
		});
}
