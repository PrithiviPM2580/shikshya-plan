import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, useLocation, useRouter } from "@tanstack/react-router";

import { Button } from "./ui/button";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();

	const isRoot = useLocation({
		select: (location) => location.pathname === "/",
	});

	console.error(error);

	return (
		<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
			<ErrorComponent error={error} />

			<div className="flex flex-wrap items-center gap-2">
				<Button
					onClick={() => router.invalidate()}
					className="uppercase font-extrabold"
				>
					Try Again
				</Button>

				{isRoot ? (
					<Button
						onClick={() => router.navigate({ to: "/" })}
						className="uppercase font-extrabold"
					>
						Home
					</Button>
				) : (
					<Button
						onClick={() => {
							if (window.history.length > 1) {
								window.history.back();
							} else {
								router.navigate({ to: "/" });
							}
						}}
						className="uppercase font-extrabold"
					>
						Go Back
					</Button>
				)}
			</div>
		</div>
	);
}
