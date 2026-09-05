import { useRouterState } from "@tanstack/react-router";
import {
	BellRing,
	Goal,
	PanelLeftCloseIcon,
	PanelLeftIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { useSidebar } from "#/components/ui/sidebar.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "../mode-toggle";
import SearchForm from "./search-form";

export default function DashboardHeader({
	shellData,
}: {
	shellData: { goal: { progress: number; target: number } | null };
}) {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const pageName = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
	const label = pageName
		.replaceAll("-", " ")
		.replace(/\b\w/g, (character) => character.toUpperCase());
	const [commandOpen, setCommandOpen] = useState<boolean>(false);
	return (
		<header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
			<div className="flex gap-5">
				<Button className="size-7" variant="outline" onClick={toggleSidebar}>
					{state === "collapsed" || isMobile ? (
						<PanelLeftIcon />
					) : (
						<PanelLeftCloseIcon />
					)}
				</Button>
				<Breadcrumb className="hidden md:block">
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>{label}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<SearchForm commandOpen={commandOpen} setCommandOpen={setCommandOpen} />
			</div>

			<div className="hidden lg:block">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1.5">
						<Goal className="size-3.5 text-primary dark:text-white" />
						<span className="text-xs font-medium text-primary dark:text-white">
							Daily Goal:
						</span>
						<span className="text-xs font-semibold text-primary dark:text-white">
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

					<Button variant="ghost" size="icon" className="size-8 rounded-lg">
						<BellRing className="size-4 text-primary dark:text-white" />
					</Button>

					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
