"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypingEffect } from "@/components/typing-effect";
import { SignInDialog } from "@/components/portfolio/dialogs/sign-in-dialog";
import { SignUpDialog } from "@/components/portfolio/dialogs/sign-up-dialog";
import { useAlert } from "@/contexts/alert-context";

export default function Home() {
	const searchParams = useSearchParams();
	const { addAlert } = useAlert();
	const [signInOpen, setSignInOpen] = useState(false);
	const [signUpOpen, setSignUpOpen] = useState(false);

	useEffect(() => {
		const mode = searchParams.get("mode");
		if (mode === "signin") {
			setSignInOpen(true);
		} else if (mode === "create") {
			setSignUpOpen(true);
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-background text-foreground relative overflow-hidden">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="lightning-bolt lightning-bolt-1"></div>
				<div className="lightning-bolt lightning-bolt-2"></div>
				<div className="lightning-bolt lightning-bolt-3"></div>
			</div>

			<header className="fixed top-0 left-0 right-0 border-b border-border bg-background/95 backdrop-blur-sm z-50">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
					<Link href="/" className="flex items-center">
						<Image
							src="/lightLogo.png"
							alt="Portfolio"
							width={40}
							height={40}
							className="block dark:hidden"
							priority
						/>
						<Image
							src="/darkLogo.png"
							alt="Portfolio"
							width={40}
							height={40}
							className="hidden dark:block"
							priority
						/>
					</Link>
					<ThemeToggle />
				</div>
			</header>

			<main className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
					{/* Main Headline and Intro */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-balance leading-tight">
								<TypingEffect text="Showcase Your Work" speed={50} />
							</h2>
							<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
								Build your professional portfolio with beautifully designed
								templates. Impress potential clients and employers with your
								projects, skills, and achievements.
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
							<Link href="mailto:lawrencecunanan77@gmail.com">
								<Button
									size="lg"
									className="gap-2 bg-blue-700 hover:bg-blue-800 text-white text-lg px-8 py-6"
								>
									Send an Email to Us
									<ArrowRight className="h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</main>

			<SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
			<SignUpDialog
				open={signUpOpen}
				onOpenChange={setSignUpOpen}
				addAlert={addAlert}
			/>
		</div>
	);
}
