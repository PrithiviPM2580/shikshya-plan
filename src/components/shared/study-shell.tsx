"use client";

import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar.tsx";
import { cn } from "#/lib/utils.ts";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";

export default function StudyShell({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn("min-h-screen bg-background text-foreground", className)}
		>
			<SidebarProvider>
				<div className="min-h-screen w-full bg-[var(--hero-a)]/10 md:flex md:min-h-screen">
					<DashboardSidebar />

					<div className="flex min-h-screen flex-1 w-full flex-col min-w-0">
						<DashboardHeader />
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
