import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
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
import SearchForm from "./search-form";

export default function DashboardHeader() {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const [commandOpen, setCommandOpen] = useState<boolean>(false);
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
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
		</header>
	);
}
