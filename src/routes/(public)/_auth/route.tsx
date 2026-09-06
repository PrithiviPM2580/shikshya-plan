import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import Logo from "#/components/shared/logo";

export const Route = createFileRoute("/(public)/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<main className="screen">
			<div className="flex min-h-screen flex-col p-screen lg:flex-row">
				<section className="flex flex-1 items-center rounded-corner bg-primary/80 px-6 py-10 text-white sm:px-10 lg:px-16 lg:py-12">
					<div className="flex w-full max-w-xl flex-col gap-10">
						<Logo className="" />

						<div>
							<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">
								<Sparkles className="size-3.5" /> Your academic companion
							</p>
							<h1 className="mt-4 max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
								Plan your study. Improve your progress.
							</h1>
							<p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/75 sm:text-base">
								Organize subjects, tasks, exams, and study sessions in one
								focused workspace with intelligent AI guidance.
							</p>
						</div>

						<ul className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
							<li className="flex items-center gap-3">
								<span className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15">
									<Sparkles className="size-4" />
								</span>
								AI-powered study plans
							</li>
							<li className="flex items-center gap-3">
								<span className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15">
									<BookOpen className="size-4" />
								</span>
								Exam and task tracking
							</li>
							<li className="flex items-center gap-3">
								<span className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15">
									<BarChart3 className="size-4" />
								</span>
								Personal progress analytics
							</li>
						</ul>

						<div className="hidden items-center gap-2 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/65 lg:flex">
							<CheckCircle2 className="size-4" />A calmer way to stay consistent
							with your studies.
						</div>
					</div>
				</section>

				<section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
					<Outlet />
				</section>
			</div>
		</main>
	);
}
