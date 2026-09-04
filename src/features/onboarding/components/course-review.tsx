import { BookOpen, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROGRAMS } from "../constants";
import type { Course } from "../types";

interface CourseReviewProps {
	programName: string;
	semesterNumber: number;
	courses: Course[];
	onNext: () => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function CourseReview({
	programName,
	semesterNumber,
	courses,
	onNext,
	onBack,
	isLoading = false,
}: CourseReviewProps) {
	const program = PROGRAMS.find((p) => p.name === programName);
	const semester = program?.semesters.find(
		(s) =>
			s.semester ===
			`${semesterNumber}${getSemesterSuffix(semesterNumber)} Semester`,
	);

	if (!semester) {
		return <div>Semester not found</div>;
	}

	const totalCredits = semester.courses.reduce((sum, c) => sum + c.credits, 0);
	const coreCourses = semester.courses.filter((c) => c.type === "core");
	const electiveCourses = semester.courses.filter((c) => c.type === "elective");

	return (
		<div className="w-full space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Review Your Courses</h2>
				<p className="text-sm text-muted-foreground mt-2">
					Here are the courses you'll be studying in{" "}
					<strong>
						{semesterNumber}
						{getSemesterSuffix(semesterNumber)} Semester
					</strong>{" "}
					of <strong>{programName}</strong>
				</p>
			</div>

			<div className="space-y-4">
				{/* Summary Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5 text-emerald-600" />
							Semester Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Total Courses</p>
								<p className="text-2xl font-bold">{semester.courses.length}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Credits</p>
								<p className="text-2xl font-bold">{totalCredits}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Practical Courses
								</p>
								<p className="text-2xl font-bold">
									{semester.courses.filter((c) => c.has_practical).length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Core Courses */}
				{coreCourses.length > 0 && (
					<div className="space-y-3">
						<h3 className="font-semibold flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Core Courses ({coreCourses.length})
						</h3>
						<div className="grid gap-3">
							{coreCourses.map((course) => (
								<Card key={course.code} className="overflow-hidden">
									<CardContent className="p-4">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h4 className="font-medium">{course.name}</h4>
												<p className="text-xs text-muted-foreground mt-1">
													{course.code}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Badge variant="secondary">
													{course.credits} Credits
												</Badge>
												{course.has_practical && (
													<Badge variant="outline">Practical</Badge>
												)}
												{course.has_exam && (
													<Badge variant="outline">Exam</Badge>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}

				{/* Elective Courses */}
				{electiveCourses.length > 0 && (
					<div className="space-y-3">
						<h3 className="font-semibold flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Elective Courses ({electiveCourses.length})
						</h3>
						<p className="text-sm text-muted-foreground">
							You'll select your electives during the semester.
						</p>
					</div>
				)}
			</div>

			<div className="flex gap-3">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={onBack}
				>
					Back
				</Button>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Loading..." : "Continue"}
				</Button>
			</div>
		</div>
	);
}

function getSemesterSuffix(n: number): string {
	if (n % 10 === 1 && n !== 11) return "st";
	if (n % 10 === 2 && n !== 12) return "nd";
	if (n % 10 === 3 && n !== 13) return "rd";
	return "th";
}
