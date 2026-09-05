import { useNavigate } from "@tanstack/react-router";
import {
	Calculator,
	Calendar,
	CreditCard,
	SearchIcon,
	Settings,
	Smile,
	User,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
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
	function goTo(to: "/calendar" | "/profile" | "/settings") {
		setCommandOpen(false);
		navigate({ to });
	}

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

						<CommandGroup heading="Suggestions">
							<CommandItem onSelect={() => goTo("/calendar")}>
								<Calendar />
								Calendar
							</CommandItem>

							<CommandItem onSelect={() => goTo("/profile")}>
								<Smile />
								Search Emoji
							</CommandItem>

							<CommandItem disabled>
								<Calculator />
								Calculator
							</CommandItem>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading="Settings">
							<CommandItem onSelect={() => goTo("/settings")}>
								<User />
								Profile
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>

							<CommandItem>
								<CreditCard />
								Billing
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>

							<CommandItem>
								<Settings />
								Settings
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			)}
		</>
	);
}
