import { useNavigate } from "@tanstack/react-router";
import {
	BookOpen,
	Calendar,
	CalendarClock,
	ChartNoAxesCombined,
	ClipboardCheck,
	Goal,
	ListTodo,
	Play,
	SearchIcon,
	Settings,
	Timer,
	User,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { Button } from "../ui/button";

interface SearchButtonProps {
	commandOpen: boolean;
	setCommandOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SearchForm({
	commandOpen,
	setCommandOpen,
}: SearchButtonProps) {
	const navigate = useNavigate();
	function goTo(
		to:
			| "/dashboard"
			| "/subjects"
			| "/plans"
			| "/sessions"
			| "/tasks"
			| "/calendar"
			| "/exams"
			| "/goals"
			| "/analytics"
			| "/pomodoro"
			| "/profile"
			| "/settings"
			| "/scheduler"
			| "/revision-planner",
	) {
		setCommandOpen(false);
		navigate({ to });
	}

	useEffect(() => {
		function handleShortcut(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setCommandOpen((open) => !open);
			}
		}
		window.addEventListener("keydown", handleShortcut);
		return () => window.removeEventListener("keydown", handleShortcut);
	}, [setCommandOpen]);

	return (
		<>
			<Button
				className="h-7 w-60 justify-start font-normal text-muted-foreground hover:text-muted-foreground"
				variant="outline"
				size="sm"
				onClick={() => setCommandOpen((open) => !open)}
			>
				<SearchIcon />
				Search
				<kbd className="pointer-events-none ml-auto inline-flex h-5 scale-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
					<span>&#8984;</span>K
				</kbd>
			</Button>
			{commandOpen && (
				<CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
					<CommandInput placeholder="Type a command or search..." />

					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="Navigate">
							<CommandItem onSelect={() => goTo("/dashboard")}>
								<ChartNoAxesCombined />
								Dashboard
							</CommandItem>
							<CommandItem onSelect={() => goTo("/subjects")}>
								<BookOpen />
								Subjects
							</CommandItem>
							<CommandItem onSelect={() => goTo("/plans")}>
								<ListTodo />
								Study Plans
							</CommandItem>
							<CommandItem onSelect={() => goTo("/sessions")}>
								<Play />
								Sessions
							</CommandItem>
							<CommandItem onSelect={() => goTo("/tasks")}>
								<ClipboardCheck />
								Tasks
							</CommandItem>
							<CommandItem onSelect={() => goTo("/calendar")}>
								<Calendar />
								Calendar
							</CommandItem>
							<CommandItem onSelect={() => goTo("/exams")}>
								<ClipboardCheck />
								Exams
							</CommandItem>
							<CommandItem onSelect={() => goTo("/goals")}>
								<Goal />
								Goals
							</CommandItem>
							<CommandItem onSelect={() => goTo("/analytics")}>
								<ChartNoAxesCombined />
								Analytics
							</CommandItem>
							<CommandItem onSelect={() => goTo("/pomodoro")}>
								<Timer />
								Pomodoro
							</CommandItem>
							<CommandItem onSelect={() => goTo("/scheduler")}>
								<CalendarClock />
								Scheduler
							</CommandItem>
							<CommandItem onSelect={() => goTo("/revision-planner")}>
								<CalendarClock />
								Revision Planner
							</CommandItem>
							<CommandItem onSelect={() => goTo("/profile")}>
								<User />
								Profile
							</CommandItem>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading="Quick Actions">
							<CommandItem onSelect={() => goTo("/settings")}>
								<Settings />
								Settings
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
							<CommandItem onSelect={() => goTo("/tasks")}>
								<ClipboardCheck />
								Create or manage tasks
							</CommandItem>
							<CommandItem onSelect={() => goTo("/sessions")}>
								<Play />
								Start a study session
							</CommandItem>
							<CommandItem onSelect={() => goTo("/goals")}>
								<Goal />
								Update goals
							</CommandItem>
							<CommandItem onSelect={() => goTo("/exams")}>
								<Calendar />
								Schedule an exam
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			)}
		</>
	);
}
