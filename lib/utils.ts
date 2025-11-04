import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatFirestoreDate(timestamp?: Timestamp | null): string {
	if (!timestamp) return "";

	const dateObj = timestamp?.toDate ? timestamp.toDate() : null;
	if (!dateObj) return "";

	return dateObj.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}
