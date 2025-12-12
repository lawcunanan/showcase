"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Link as LinkIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypingEffect } from "@/components/typing-effect";
import { SignInDialog } from "@/components/portfolio/dialogs/sign-in-dialog";
import { SignUpDialog } from "@/components/portfolio/dialogs/sign-up-dialog";
import { useAlert } from "@/providers/alert-context";
import { getActiveUsers } from "@/controllers/get/getActiveUsers";
import type { User } from "@/lib/mock-data";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { addAlert } = useAlert();
	const [signInOpen, setSignInOpen] = useState(false);
	const [signUpOpen, setSignUpOpen] = useState(false);
	const [activeUsers, setActiveUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const mode = searchParams.get("mode");
		if (mode === "signin") {
			setSignInOpen(true);
		} else if (mode === "create") {
			setSignUpOpen(true);
		}
	}, [searchParams]);

	useEffect(() => {
		const unsubscribe = getActiveUsers(setActiveUsers, setLoading);
		return () => unsubscribe();
	}, []);

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

			<main className="relative z-10 flex items-center justify-center min-h-screen px-6 ">
				<div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in w-full">
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

					{/* Active Portfolios Showcase */}
					{!loading && activeUsers.length > 0 && (
						<div className="pt-12 w-full overflow-hidden animate-fade-in-up">
							<h3 className="text-xl font-semibold mb-6">
								Featured Portfolios
							</h3>
							<div className="overflow-hidden relative">
								<div className="animate-scroll">
									{[...activeUsers, ...activeUsers].map((user, index) => (
										<div
											key={`${user.id}-${index}`}
											className="flex-shrink-0 w-72 sm:w-80 mx-3 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
											onClick={() => router.push(`/portfolio/${user.username}`)}
										>
											<div className="space-y-2">
												<h4 className="font-semibold text-sm truncate">
													{user.name}
												</h4>
												{user.about && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{user.about}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Developer Credit */}
			<footer className="pb-8">
				<div className="text-center space-y-1">
					<p className="text-xs text-muted-foreground">Developer</p>
					<Link
						href="https://lacunanan.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary transition-colors"
					>
						Lawrence S. Cunanan
						<LinkIcon className="h-3 w-3" />
					</Link>
				</div>
			</footer>

			<SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
			<SignUpDialog
				open={signUpOpen}
				onOpenChange={setSignUpOpen}
				addAlert={addAlert}
			/>
		</div>
	);
}
