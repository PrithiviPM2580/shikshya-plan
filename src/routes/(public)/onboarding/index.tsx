import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Logo from "#/components/shared/logo";
import { Button } from "#/components/ui/button";
import { studyLevels } from "#/lib/constants";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/(public)/onboarding/")({
	component: Onboarding,
});

function Onboarding() {
	const [progress] = useState<number>(5);
	const [selected, setSelected] =
		useState<(typeof studyLevels)[number]["id"]>("bca");

	const selectedLevel =
		studyLevels.find((level) => level.id === selected) ?? studyLevels[0];

	return (
		<div className="min-h-screen w-full px-2 sm:px-8 md:px-16 lg:h-28">
			<header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-4 sm:gap-8 sm:py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Logo />
						<p className="text-lg font-semibold tracking-[-0.04em]">
							Shikshya Plan
						</p>
					</div>

					<div className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] sm:flex">
						<button
							type="button"
							className="transition-colors hover:text-primary"
						>
							Save & Exit
						</button>

						<button
							type="button"
							className="transition-colors hover:text-primary"
						>
							Help
						</button>
					</div>
				</div>

				<Progress value={progress} className="w-full" />
			</header>

			<main className="mx-auto w-full max-w-7xl py-2 sm:py-4">
				<div className="flex w-full flex-col gap-6 md:flex-row">
					{/* Sidebar */}
					<aside className="w-full space-y-5 md:w-72 md:shrink-0 lg:w-80">
						<div className="rounded-2xl border border-[#173a40]/10 bg-white/70 p-4 shadow-[0_10px_30px_rgba(23,58,64,0.04)] backdrop-blur-sm">
							<h3 className="text-xl font-semibold tracking-[-0.04em]">
								Academic Profile
							</h3>

							<p className="mt-2 text-sm leading-6">
								Your personalized study plan will adapt to these settings.
							</p>

							<div className="mt-5 space-y-4 text-sm">
								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Degree
									</span>

									<span className="min-w-0 truncate text-right font-medium">
										{selectedLevel.label}
									</span>
								</div>

								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Semester
									</span>

									<span className="font-medium">-</span>
								</div>

								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Subjects
									</span>

									<span className="font-medium">-</span>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#173a40]/10 bg-[#f5f7fb] p-4 shadow-[0_10px_30px_rgba(23,58,64,0.04)]">
							<div className="mb-3 flex items-center gap-2">
								<div className="size-2 shrink-0 rounded-full bg-primary" />

								<p className="text-xs font-semibold uppercase tracking-[0.2em]">
									Pro Tip
								</p>
							</div>

							<p className="text-sm leading-6">
								Selecting accurate details helps us fetch the most relevant
								syllabi and past papers for you.
							</p>
						</div>
					</aside>

					{/* Main content */}
					<section className="w-full min-w-0 flex-1 rounded-2xl border border-[#173a40]/10 bg-white/80 p-3 shadow-[0_20px_50px_rgba(23,58,64,0.05)] backdrop-blur-sm sm:p-5 lg:p-6">
						{/* Step indicator */}
						<div className="mb-5 flex w-fit items-center rounded-full bg-[rgba(99,102,241,0.12)] px-3 py-1.5">
							<div className="size-2 shrink-0 rounded-full bg-primary" />

							<span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
								Step 1 of 5
							</span>
						</div>

						{/* Heading */}
						<div className="space-y-2">
							<h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
								Welcome to Shikshya Plan
							</h1>

							<p className="max-w-2xl text-sm leading-6 md:text-base">
								Let&apos;s personalize your study space. First, tell us about
								your current academic focus.
							</p>
						</div>

						{/* Question */}
						<h2 className="mt-8 text-base font-medium tracking-[-0.04em] sm:text-lg md:text-xl">
							What is your current study level?
						</h2>

						{/* Study level cards */}
						<div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:gap-6">
							{studyLevels.map((level) => {
								const isSelected = selected === level.id;

								return (
									<button
										key={level.id}
										type="button"
										onClick={() => setSelected(level.id)}
										className={[
											"group relative w-full min-w-0 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
											isSelected
												? "border-primary bg-[rgba(99,102,241,0.08)] shadow-[0_12px_25px_rgba(99,102,241,0.12)]"
												: "border-[#173a40]/10 bg-[#f3f5f7] hover:border-[#173a40]/20 hover:bg-[#f9fafb]",
										].join(" ")}
									>
										<div
											className={[
												"mb-4 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
												isSelected
													? "bg-primary text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]"
													: "bg-[#e5e7eb]",
											].join(" ")}
										>
											{level.short}
										</div>

										<div className="min-w-0 space-y-1">
											<p className="truncate text-xl font-semibold sm:text-2xl">
												{level.label}
											</p>

											<p className="truncate text-sm sm:text-base">
												{level.subtitle}
											</p>
										</div>
									</button>
								);
							})}
						</div>

						{/* Next button */}
						<div className="mt-8 flex justify-end sm:mt-10">
							<Button
								type="button"
								className="inline-flex items-center gap-3 rounded-lg bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4f5ae8] sm:px-7 sm:text-sm"
							>
								Next Step
								<span aria-hidden="true">→</span>
							</Button>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
