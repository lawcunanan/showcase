import { Code2 } from "lucide-react";

export function TechnologiesSection({
	technologies,
}: {
	technologies: string[];
}) {
	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl  font-bold mb-3">Tech Stack</h2>
			</div>

			{technologies && technologies.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{technologies.map((tech, index) => (
						<span
							key={index}
							className="px-3 py-1.5 border border-border rounded-full text-sm font-medium text-foreground hover:border-primary transition-colors"
						>
							{tech}
						</span>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<Code2 className="w-12 h-12 text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground text-sm">
						No technologies added yet.
					</p>
				</div>
			)}
		</section>
	);
}
