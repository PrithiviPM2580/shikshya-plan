import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface SearchButtonProps {
	commandOpen: boolean;
	setCommandOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SearchForm({
	commandOpen,
	setCommandOpen,
}: SearchButtonProps) {
	return (
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
	);
}
