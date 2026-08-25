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

export default function DashboardHeader() {
	const { state, toggleSidebar, isMobile } = useSidebar();
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
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Data Fetching</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<SearchForm commandOpen={commandOpen} setCommandOpen={setCommandOpen} />
			</div>

			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1.5">
					<Goal className="size-3.5 text-primary dark:text-white" />
					<span className="text-xs font-medium text-primary dark:text-white">
						Daily Goal:
					</span>
					<span className="text-xs font-semibold text-primary dark:text-white">
						85%
					</span>
				</div>

				<Button variant="ghost" size="icon" className="size-8 rounded-lg">
					<BellRing className="size-4 text-primary dark:text-white" />
				</Button>

				<ModeToggle />
			</div>
		</header>
	);
}
