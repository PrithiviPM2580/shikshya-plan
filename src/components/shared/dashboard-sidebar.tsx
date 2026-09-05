import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "#/components/ui/sidebar.tsx";
import {
	metaSidebarItems,
	primarySidebarItems,
	secondarySidebarItems,
} from "#/lib/constants.ts";
import { Button } from "../ui/button";
import Logo from "./logo";
import { NavUser } from "./nav-user";

export type SidebarItem = {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	activeOptions?: {
		exact?: boolean;
	};
};

export default function DashboardSidebar({
	shellData,
}: {
	shellData: {
		user: { name: string; email: string; avatar: string };
		tasksDone: number;
		taskCount: number;
		goal: { title: string; progress: number; target: number } | null;
	};
}) {
	const renderGroup = (label: string, items: readonly SidebarItem[]) => (
		<SidebarGroup>
			<SidebarGroupLabel>{label}</SidebarGroupLabel>

			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.label} className="gap-0.5!">
							<Button
								asChild
								variant="ghost"
								className="group flex w-full items-center justify-start gap-3 rounded-lg px-4 py-1 text-left text-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
							>
								<Link
									{...item}
									activeProps={{
										className: "bg-primary/10 text-primary",
									}}
								>
									<item.icon className="size-4" />

									<span className="font-medium">{item.label}</span>

									{item.label === "Tasks" && shellData.taskCount > 0 && (
										<Badge variant="secondary" className="ml-auto">
											{shellData.taskCount - shellData.tasksDone}
										</Badge>
									)}
								</Link>
							</Button>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);

	return (
		<Sidebar className="border-r border-border bg-surface text-foreground">
			{/* Header */}
			<SidebarHeader className="border-b border-border/70 px-6 py-[11.5px]">
				<div className="flex items-center gap-3">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
						<Logo className="h-auto w-7" />
					</div>

					<div>
						<p className="text-xs leading-tight uppercase tracking-[0.15em] text-muted-foreground">
							Shikshya Plan
						</p>

						<p className="text-xs leading-tight uppercase tracking-[0.15em] text-muted-foreground">
							Study
						</p>
					</div>
				</div>
			</SidebarHeader>

			{/* Navigation */}
			<SidebarContent className="overflow-visible px-2 pt-1.5">
				{/* Plan */}
				{renderGroup("Plan", primarySidebarItems)}

				{/* Track */}
				{renderGroup("Track", secondarySidebarItems)}

				{/* Account */}
				{renderGroup("Account", metaSidebarItems)}
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter className="shrink-0 space-y-0.5 border-t border-border/70 px-3 py-3">
				{/* Today's Goal */}
				<div className="rounded-xl border border-border bg-background p-3 shadow-sm hidden sm:block">
					<div className="flex items-center justify-between gap-2">
						<div>
							<p className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
								Today’s goal
							</p>

							<p className="mt-0.5 text-xs font-semibold">
								{shellData.taskCount - shellData.tasksDone} tasks remaining
							</p>
						</div>

						<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
							{shellData.goal
								? Math.min(
										100,
										Math.round(
											(shellData.goal.progress / shellData.goal.target) * 100,
										),
									)
								: 0}
							%
						</span>
					</div>

					<p className="mt-1 text-[11px] leading-tight text-muted-foreground">
						Keep your momentum with short focused sessions.
					</p>
				</div>

				{/* User */}
				<NavUser user={shellData.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
