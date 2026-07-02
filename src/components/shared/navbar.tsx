import { Link } from "@tanstack/react-router";
import { navbarLinkOptions } from "#/lib/constants";
import { Button } from "../ui/button";
import Logo from "./logo";

export default function Navbar() {
	return (
		<header className="header">
			<div className="flex items-center gap-2">
				<Logo />
				<h4>Shikshya Plan</h4>
			</div>
			<nav className="nav">
				<ul className="flex gap-4 sm:gap-5 md:gap-8 lg:gap-16">
					{navbarLinkOptions.map((link) => (
						<li key={link.hash}>
							<Link {...link} activeProps={{ className: "font-bold" }}>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<Button className="btn">Sign Up</Button>
		</header>
	);
}
