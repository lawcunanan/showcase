import { Image } from "lucide-react";

export function GallerySection({ gallery }: { gallery: string[] }) {
	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl  font-bold mb-3">Gallery</h2>
			</div>

			{gallery && gallery.length > 0 ? (
				<div className="flex gap-6 overflow-x-auto pb-4">
					{gallery.map((picture, index) => (
						<div
							key={index}
							className="group overflow-hidden rounded-lg flex-shrink-0 w-60 bg-muted"
						>
							<img
								src={picture || "/placeholder.svg"}
								alt="Gallery Image"
								className="w-full h-34 object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<Image className="w-12 h-12 text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground text-sm">
						No gallery images available yet.
					</p>
				</div>
			)}
		</section>
	);
}
