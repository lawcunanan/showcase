import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { AlertProvider } from "@/contexts/alert-context";
import { AlertContainer } from "@/components/portfolio/alert-container";
import { UserContextAuthProvider } from "@/contexts/user-context";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "My Portfolio",
	description: "Welcome to my personal portfolio website.",
	generator: "Lawrence S. Cunanan",
	icons: {
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`font-sans antialiased`}>
				<AlertProvider>
					<UserContextAuthProvider>
						{children}
						<AlertContainer />
					</UserContextAuthProvider>
				</AlertProvider>

				<Analytics />
			</body>
		</html>
	);
}
