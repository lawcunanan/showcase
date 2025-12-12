"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FadeInImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	containerClassName?: string;
}

export function FadeInImage({
	className,
	containerClassName,
	alt,
	src,
	...props
}: FadeInImageProps) {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div
			className={cn("relative overflow-hidden bg-muted", containerClassName)}
		>
			{isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
			<img
				src={src || "/placeholder.svg"}
				alt={alt || ""}
				className={cn(
					"w-full h-full object-cover transition-opacity duration-300",
					isLoading ? "opacity-0" : "opacity-100",
					className,
				)}
				onLoad={() => setIsLoading(false)}
				{...props}
			/>
		</div>
	);
}
