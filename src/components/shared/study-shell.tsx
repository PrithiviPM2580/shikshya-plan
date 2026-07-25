"use client";

import { Link } from "@tanstack/react-router";
import { Bell, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Separator } from "#/components/ui/separator.tsx";
import { sidebarItemsOptions } from "#/lib/constants.ts";
import { cn } from "#/lib/utils.ts";
import Logo from "./logo";

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
			<div className="grid min-h-screen grid-cols-[18rem_1fr] overflow-hidden">
				<aside className="border-r border-border bg-surface px-6 py-8 text-sm text-foreground">
					<div className="flex items-center gap-3 pb-8">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
							<Logo />
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
								Shikshya Plan
							</p>
							<h1 className="mt-1 text-base font-semibold">s</h1>
						</div>
					</div>

					<div className="space-y-1">
						{sidebarItemsOptions.map(({ label, icon: Icon, ...linkProps }) => (
							<Link
								key={label}
								{...linkProps}
								className={cn(
									"flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-200 hover:bg-primary/10 hover:text-primary",
									"text-foreground",
								)}
								activeProps={{
									className: "bg-primary/10 text-primary",
								}}
							>
								<Icon className="size-4" />
								<span className="font-medium">{label}</span>

								{label === "Tasks" && (
									<Badge variant="secondary" className="ml-auto">
										4
									</Badge>
								)}
							</Link>
						))}
					</div>

					<Separator className="my-8" />

					<div className="space-y-4 rounded-3xl bg-primary/5 p-4 text-sm text-foreground shadow-sm">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
								<Sparkles className="size-5" />
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Study Tip
								</p>
								<p className="mt-1 font-semibold">Focus on Physics today</p>
							</div>
						</div>
						<p className="text-sm leading-6 text-muted-foreground">
							Your retention peaks in the morning hours between 9 AM and 11 AM.
						</p>
					</div>

					<div className="mt-10 rounded-3xl border border-border bg-background p-4 shadow-sm">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarFallback>AJ</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold">Alex Johnson</p>
								<p className="text-xs text-muted-foreground">Physics Major</p>
							</div>
						</div>
						<div className="mt-4 grid gap-2 text-xs text-muted-foreground">
							<div className="flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
								<span>Weekly focus</span>
								<span className="font-semibold text-foreground">24h</span>
							</div>
							<div className="flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
								<span>Next session</span>
								<span className="font-semibold text-foreground">09:00 AM</span>
							</div>
						</div>
					</div>
				</aside>

				<div className="flex min-h-screen flex-col bg-[var(--hero-a)]/10">
					<header className="sticky top-0 z-20 border-b border-border/70 bg-[var(--header-bg)]/95 px-6 py-4 backdrop-blur-xl">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="space-y-3">
								<div className="flex flex-wrap items-center gap-3">
									<div>
										<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
											Study Helper
										</p>
										<h2 className="text-lg font-semibold">Academic Momentum</h2>
									</div>
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
								<Button className="whitespace-nowrap">
									Start Study Session
								</Button>
							</div>
						</div>
					</header>

					<main className="flex-1 overflow-y-auto p-6">
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
											<p className="text-sm font-semibold">Weekly allocation</p>
											<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
												<span>Physics</span>
												<span>40%</span>
											</div>
										</div>
										<div className="rounded-3xl bg-background p-5 shadow-sm">
											<p className="text-sm font-semibold">Unscheduled tasks</p>
											<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
												<span>Revise History</span>
												<span>4 tasks</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
