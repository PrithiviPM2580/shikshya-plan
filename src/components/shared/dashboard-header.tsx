"use client";

import { Bell } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { SidebarTrigger } from "#/components/ui/sidebar.tsx";

export default function DashboardHeader() {
	return (
		<header className="sticky top-0 z-20 border-b border-border/70 bg-[var(--header-bg)]/95 px-6 py-4 backdrop-blur-xl">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-3">
					<SidebarTrigger className="md:hidden" />
					<div className="space-y-1">
						<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
							Study Helper
						</p>
						<h2 className="text-lg font-semibold">Academic Momentum</h2>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="w-full max-w-sm md:w-auto">
						<Input placeholder="Search tasks or courses" />
					</div>
					<Button variant="secondary" className="whitespace-nowrap">
						<Bell className="size-4" />
						Notifications
					</Button>
					<Button className="whitespace-nowrap">Start Study Session</Button>
				</div>
			</div>
		</header>
	);
}
