import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<ComponentPropsWithoutRef<"section">>;

export default function Section({
	id,
	children,
	className = "",
	...props
}: SectionProps) {
	return (
		<section
			id={id}
			className={`w-full py-4 sm:py-8 md:py-10 lg:py-12  ${className}`}
			{...props}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
		</section>
	);
}
