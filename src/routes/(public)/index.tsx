import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/")({ component: Home });

function Home() {
	return (
		<section className="hero">
			{/* Left Beam */}
			<div className="beam beam-left" />

			{/* Right Beam */}
			<div className="beam beam-right" />

			{/* Center Glow */}
			<div className="hero-glow" />

			{/* Dashboard Glow */}
			<div className="dashboard-glow" />

			{/* Dashboard */}
			<div className="dashboard">
				<div className="dashboard-top">
					<span />
					<span />
					<span />
				</div>

				<div className="dashboard-content">
					<div className="card" />
					<div className="card" />
					<div className="card" />
					<div className="card" />
					<div className="card large" />
					<div className="card large" />
				</div>
			</div>
		</section>
	);
}
