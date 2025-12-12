"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Check if dark mode is already set
		const htmlElement = document.documentElement;
		setIsDark(htmlElement.classList.contains("dark"));
	}, []);

	const toggleTheme = () => {
		const htmlElement = document.documentElement;
		if (isDark) {
			htmlElement.classList.remove("dark");
			setIsDark(false);
		} else {
			htmlElement.classList.add("dark");
			setIsDark(true);
		}
	};

	if (!mounted) return null;

	return (
		<button
			onClick={toggleTheme}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg cursor-pointer"
		>
			{/* Sun Icon (Left side) */}
			<Sun
				className={`absolute left-2 h-5 w-5 transition-all duration-300 ${
					isDark
						? "text-gray-500 opacity-50"
						: "text-yellow-500 opacity-100 scale-110"
				}`}
			/>

			{/* Moon Icon (Right side) */}
			<Moon
				className={`absolute right-2 h-5 w-5 transition-all duration-300 ${
					isDark
						? "text-blue-400 opacity-100 scale-110"
						: "text-gray-500 opacity-50"
				}`}
			/>

			{/* Toggle Circle */}
			<span
				className={`flex items-center justify-center h-8 w-8 transform rounded-full shadow-lg transition-all duration-300 ease-in-out ${
					isDark ? "translate-x-11 bg-gray-800" : "translate-x-1 bg-yellow-400"
				}`}
			>
				{isDark ? (
					<Moon className="h-4 w-4 text-blue-300" />
				) : (
					<Sun className="h-4 w-4 text-yellow-700" />
				)}
			</span>
		</button>
	);
}
