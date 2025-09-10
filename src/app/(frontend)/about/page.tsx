export default function About() {
	return (
		<div className="max-w-2xl mx-auto py-12 px-4">
			<h1 className="text-4xl font-bold mb-4">About Cookbook</h1>
			<p className="text-lg mb-6 text-muted-foreground">
				Welcome to <span className="font-semibold">Cookbook</span>! This
				platform is built with{" "}
				<span className="font-semibold">React</span>,{" "}
				<span className="font-semibold">Next.js</span>,{" "}
				<span className="font-semibold">Tailwind CSS</span>, and{" "}
				<span className="font-semibold">shadcn/ui</span> to provide a
				modern, fast, and beautiful recipe sharing experience.
			</p>
			<div className="rounded-lg border p-6 bg-background shadow-sm">
				<h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
				<p>
					CookbookWeb empowers home cooks and food lovers to discover,
					share, and organize their favorite recipes. Whether you’re a
					seasoned chef or just starting out, our community-driven
					platform makes it easy to find inspiration and connect with
					others.
				</p>
			</div>
		</div>
	);
}
