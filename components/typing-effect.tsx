"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
	text: string;
	className?: string;
	speed?: number;
	deleteSpeed?: number;
	pauseTime?: number;
}

export function TypingEffect({
	text,
	className = "",
	speed = 100,
}: TypingEffectProps) {
	const [displayedText, setDisplayedText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(() => {
				setDisplayedText((prev) => prev + text[currentIndex]);
				setCurrentIndex((prev) => prev + 1);
			}, speed);

			return () => clearTimeout(timeout);
		}
	}, [currentIndex, text, speed]);

	return <span className={className}>{displayedText}</span>;
}
