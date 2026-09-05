"use client";

import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar.tsx";
import { cn } from "#/lib/utils.ts";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import NotificationReminders from "./notification-reminders";

export default function StudyShell({
	children,
	className,
	shellData,
}: {
	children?: React.ReactNode;
	className?: string;
	shellData: {
		user: { name: string; email: string; avatar: string };
		tasksDone: number;
		taskCount: number;
		goal: { title: string; progress: number; target: number } | null;
		notificationPreferences: {
			tasks: boolean;
			exams: boolean;
			sessions: boolean;
		};
		reminders: {
			tasks: { id: string; title: string; dueDate: Date | null }[];
			exams: { id: string; title: string; examDate: Date }[];
			sessions: { id: string; title: string; scheduledDate: Date }[];
		};
	};
}) {
	return (
		<div
			className={cn("min-h-screen bg-background text-foreground", className)}
		>
			<SidebarProvider>
				<div className="min-h-screen w-full bg-[var(--hero-a)]/10 md:flex md:min-h-screen">
					<NotificationReminders
						preferences={shellData.notificationPreferences}
						reminders={{
							tasks: shellData.reminders.tasks.map((task) => ({
								id: task.id,
								title: task.title,
								dueAt: task.dueDate,
							})),
							exams: shellData.reminders.exams.map((exam) => ({
								id: exam.id,
								title: exam.title,
								dueAt: exam.examDate,
							})),
							sessions: shellData.reminders.sessions.map((session) => ({
								id: session.id,
								title: session.title,
								dueAt: session.scheduledDate,
							})),
						}}
					/>
					<DashboardSidebar shellData={shellData} />

					<div className="flex min-h-screen flex-1 w-full flex-col min-w-0">
						<DashboardHeader shellData={shellData} />
						<SidebarInset className="flex-1 min-w-0 overflow-y-auto p-6">
							{children ?? (
								<div className="rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
									<div className="mx-auto max-w-2xl space-y-4">
										<span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
											Study shell preview
										</span>
										<h3 className="text-2xl font-semibold">
											This area is reserved for page content.
										</h3>
										<p className="text-sm leading-6 text-muted-foreground">
											Use the sidebar and header component in your page layout.
											The shell renders the site navigation, top controls, and
											main content region.
										</p>
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="rounded-3xl bg-background p-5 shadow-sm">
												<p className="text-sm font-semibold">
													Weekly allocation
												</p>
												<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
													<span>Physics</span>
													<span>40%</span>
												</div>
											</div>
											<div className="rounded-3xl bg-background p-5 shadow-sm">
												<p className="text-sm font-semibold">
													Unscheduled tasks
												</p>
												<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
													<span>Revise History</span>
													<span>4 tasks</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</SidebarInset>
					</div>
				</div>
			</SidebarProvider>
		</div>
	);
}
