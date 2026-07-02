import logo from "#/assets/svgs/logo.svg";
import { cn } from "#/lib/utils";

type LogoProps = {
	className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
	return <img src={logo} alt="Logo" className={cn("logo", className)} />;
}
