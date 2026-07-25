"use client";

import {
	Bell,
	PanelLeftCloseIcon,
	PanelLeftIcon,
	SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { SidebarTrigger, useSidebar } from "#/components/ui/sidebar.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "../ui/separator";
import SearchForm from "./search-form";

export default function DashboardHeader() {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const [commandOpen, setCommandOpen] = useState<boolean>(false);
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Button className="size-9" variant="outline" onClick={toggleSidebar}>
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
