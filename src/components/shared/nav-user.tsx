"use client";

import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "#/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	async function handleLogout() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success("Signed out");
					navigate({ to: "/" });
				},
				onError: (context) => {
					toast.error(context.error.message);
				},
			},
		});
	}

	return (
		<div className="overflow-hidden rounded-lg bg-background border border-border">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="flex w-full items-center gap-3 rounded-none bg-background px-3 py-2 text-left text-foreground outline-none shadow-none transition duration-200 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0 focus-visible:shadow-none active:bg-primary/10 active:text-primary"
					>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user.name}</span>
							<span className="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
					side={isMobile ? "bottom" : "right"}
					align="end"
					sideOffset={4}
				>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={handleLogout}>
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
