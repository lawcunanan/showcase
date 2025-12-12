"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, Download, Copy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AboutSection } from "@/components/portfolio/about-section";
import { TechnologiesSection } from "@/components/portfolio/technologies-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { AchievementsSection } from "@/components/portfolio/achievements-section";
import { GallerySection } from "@/components/portfolio/gallery-section";
import { ContactsSection } from "@/components/portfolio/contacts-section";
import { EditDropdown } from "@/components/portfolio/edit-dropdown";
import { InformationDialog } from "@/components/portfolio/dialogs/information-dialog";
import { AchievementsDialog } from "@/components/portfolio/dialogs/achievements-dialog";
import { GalleryDialog } from "@/components/portfolio/dialogs/gallery-dialog";
import { ProjectsDialog } from "@/components/portfolio/dialogs/projects-dialog";
import { SignOutDialog } from "@/components/portfolio/dialogs/sign-out-dialog";
import { useUserAuth } from "@/providers/user-context";
import { useAlert } from "@/providers/alert-context";

export default function PortfolioPage() {
	const { userDetails, userRef } = useUserAuth();
	const { addAlert } = useAlert();
	const [informationDialogOpen, setInformationDialogOpen] = useState(false);
	const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
	const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
	const [projectsDialogOpen, setProjectsDialogOpen] = useState(false);
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

	if (!userDetails) return null;

	return (
		<div className="min-h-screen bg-background text-foreground p-6 md:p-16">
			{/* Hero Section */}
			<section className=" max-w-6xl mx-auto pb-6 border-b border-border relative flex flex-col sm:flex-row items-start gap-8 animate-fade-in">
				{userDetails?.avatar && (
					<div
						className="hidden sm:flex flex-shrink-0 animate-fade-in-up bg-muted rounded-lg "
						style={{ animationDelay: "0.1s" }}
					>
						<Image
							src={userDetails?.avatar || "/placeholder.svg"}
							alt={userDetails?.name}
							width={150}
							height={150}
							className="rounded-lg object-cover  w-46 h-46 "
						/>
					</div>
				)}

				<div
					className="flex-1 space-y-4  animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					<div className="flex items-center gap-2 flex-wrap">
						<h1 className="text-4xl lg:text-5xl font-bold">
							{userDetails?.name}
						</h1>
					</div>
					{userDetails?.title && (
						<p className="text-lg lg:text-2xl text-muted-foreground ">
							{userDetails?.title}
						</p>
					)}
					{userDetails?.location && (
						<div className="flex items-center gap-2 text-muted-foreground text-base">
							<MapPin className="h-5 w-5 flex-shrink-0" />
							<p>{userDetails?.location}</p>
						</div>
					)}

					<div className="flex flex-wrap gap-3 mt-6">
						{userDetails?.cvUrl && (
							<Button
								className="gap-2 bg-blue-600 border text-white hover:bg-blue-900 cursor-pointer"
								onClick={() => {
									window.open(userDetails.cvUrl, "_blank");
								}}
							>
								<Download className="h-4 w-4" />
								Download my CV
							</Button>
						)}
						{userDetails?.phone && (
							<Button
								className="gap-2 bg-background border text-foreground hover:bg-foreground hover:text-background cursor-pointer"
								onClick={() => {
									window.location.href = `tel:${userDetails?.phone}`;
								}}
							>
								<Phone className="h-4 w-4" />
								{userDetails?.phone}
							</Button>
						)}
						<a
							href={`mailto:${userDetails?.email}`}
							className="gap-2 bg-background border text-foreground hover:bg-foreground hover:text-background cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
						>
							<Mail className="h-4 w-4" />
							Send Email
						</a>
						<ShareButton />
					</div>
				</div>

				<div
					className="flex gap-2 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					<ThemeToggle />

					{userDetails?.isCurrentUser && (
						<>
							<Button
								variant="outline"
								size="icon"
								aria-label="Sign out"
								className="rounded-full bg-transparent"
								onClick={() => setSignOutDialogOpen(true)}
							>
								<LogOut className="h-4 w-4" />
							</Button>
							<EditDropdown
								onYourInformation={() => setInformationDialogOpen(true)}
								onAchievements={() => setAchievementsDialogOpen(true)}
								onProjects={() => setProjectsDialogOpen(true)}
								onGallery={() => setGalleryDialogOpen(true)}
							/>
						</>
					)}
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto py-12 space-y-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
					<div
						className="lg:col-span-2 space-y-12 animate-fade-in-up"
						style={{ animationDelay: "0.4s" }}
					>
						<AboutSection content={userDetails?.about} />
						<TechnologiesSection
							technologies={userDetails?.technologies || []}
						/>
						<GallerySection gallery={userDetails?.galleryImages || []} />
					</div>

					<div
						className="space-y-12 animate-fade-in-up"
						style={{ animationDelay: "0.5s" }}
					>
						{userRef && (
							<AchievementsSection
								userRef={userRef}
								isEditable={userDetails?.isCurrentUser}
								dialogOpen={achievementsDialogOpen}
								onDialogOpenChange={setAchievementsDialogOpen}
								addAlert={addAlert}
							/>
						)}
						<ContactsSection user={userDetails} />
					</div>
				</div>
				<div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
					{userRef && (
						<ProjectsSection
							userRef={userRef}
							isEditable={userDetails?.isCurrentUser}
							dialogOpen={projectsDialogOpen}
							onDialogOpenChange={setProjectsDialogOpen}
							userDetails={userDetails}
							addAlert={addAlert}
						/>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer
				className="border-t border-border max-w-6xl mx-auto py-6 animate-fade-in"
				style={{ animationDelay: "0.7s" }}
			>
				<div className="flex items-left gap-6">
					<div className="text-left space-y-2 text-sm">
						<p className="text-muted-foreground">
							Built with Next.js and Tailwind CSS, deployed with Vercel
						</p>
						<p className="text-muted-foreground">
							© 2025 {userDetails?.name}. All rights reserved.
						</p>
					</div>
				</div>
			</footer>

			{/* Dialogs */}
			<SignOutDialog
				open={signOutDialogOpen}
				onOpenChange={setSignOutDialogOpen}
				addAlert={addAlert}
			/>
			<InformationDialog
				open={informationDialogOpen}
				onOpenChange={setInformationDialogOpen}
				userRef={userRef}
				userdetails={userDetails}
				addAlert={addAlert}
			/>
			<GalleryDialog
				open={galleryDialogOpen}
				onOpenChange={setGalleryDialogOpen}
				userRef={userRef}
				userdetails={userDetails}
				addAlert={addAlert}
			/>
		</div>
	);
}

function ShareButton() {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy URL", err);
		}
	};

	return (
		<Button
			className="gap-2 bg-background border text-foreground hover:bg-foreground hover:text-background cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
			onClick={handleShare}
		>
			<Copy className="h-4 w-4" />
			{copied ? "Copied!" : "Share"}
		</Button>
	);
}
