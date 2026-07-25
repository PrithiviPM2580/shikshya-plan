import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarSeparator,
} from "#/components/ui/sidebar.tsx";
import { sidebarItemsOptions } from "#/lib/constants.ts";
import { Button } from "../ui/button";
import Logo from "./logo";
import { NavUser } from "./nav-user";

export default function DashboardSidebar() {
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
	};
	return (
		<Sidebar className="border-r border-border bg-surface text-foreground">
			<SidebarHeader className="border-b border-border/70 px-6 pb-6">
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
						<Logo />
					</div>
					<div>
						<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
							Shikshya Plan
						</p>
						<h1 className="mt-1 text-base font-semibold">Study</h1>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-2 py-4 overflow-visible">
				<SidebarGroup className="space-y-2">
					<SidebarMenu>
						{sidebarItemsOptions.map((item) => (
							<SidebarMenuItem key={item.label}>
								<Button
									key={item.label}
									asChild
									variant="ghost"
									className="group flex w-full justify-start items-center gap-3 rounded-lg px-4 py-3 text-left text-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
								>
									<Link
										{...item}
										activeProps={{
											className: "bg-primary/10 text-primary",
										}}
									>
										<item.icon className="size-4" />
										<span className="font-medium">{item.label}</span>

										{item.label === "Tasks" && (
											<Badge variant="secondary" className="ml-auto">
												4
											</Badge>
										)}
									</Link>
								</Button>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<div className="px-4">
				<SidebarSeparator />
			</div>

			<SidebarFooter className="px-6 py-4 space-y-3">
				<div className="rounded-3xl border border-border bg-background p-4 shadow-sm">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
								Today’s goal
							</p>
							<p className="mt-1 font-semibold">Finish 2 tasks</p>
						</div>
						<span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
							58%
						</span>
					</div>
					<p className="mt-3 text-xs text-muted-foreground">
						Keep your momentum with short focused sessions.
					</p>
				</div>

				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
