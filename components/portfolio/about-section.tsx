export function AboutSection({ content }: { content: string }) {
	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl  font-bold mb-3">About</h2>
			</div>
			<p className="text-base text-muted-foreground leading-relaxed ">
				{content}
			</p>
		</section>
	);
}
