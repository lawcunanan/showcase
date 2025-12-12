"use client";

import { DocumentReference } from "firebase/firestore";
import { ExternalLink, FolderOpen } from "lucide-react";
import { getProjects } from "@/controllers/get/getProjects";
import { useEffect, useState } from "react";
import type { Project, User } from "@/lib/mock-data";
import { useAlert } from "@/providers/alert-context";
import { ProjectsDialog } from "@/components/portfolio/dialogs/projects-dialog";
import { AlertType } from "@/providers/alert-context";
import { FadeInImage } from "@/components/ui/fade-in-image";

interface ProjectsSectionProps {
	userRef: DocumentReference;
	isEditable?: boolean;
	dialogOpen?: boolean;
	onDialogOpenChange?: (open: boolean) => void;
	userDetails?: User | null;
	addAlert?: (type: AlertType, message: string) => void;
}

export function ProjectsSection({
	userRef,
	isEditable = false,
	dialogOpen = false,
	onDialogOpenChange,
	userDetails,
	addAlert: addAlertProp,
}: ProjectsSectionProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const { addAlert: addAlertContext } = useAlert();
	const addAlert = addAlertProp || addAlertContext;

	useEffect(() => {
		const unsubscribe = getProjects(userRef, setProjects, setLoading, addAlert);
		return () => unsubscribe();
	}, [userRef, addAlert]);

	const shimmerCards = Array.from({ length: 3 }).map((_, i) => (
		<div
			key={i}
			className="animate-pulse bg-card border border-border rounded-lg overflow-hidden flex flex-col"
		>
			<div className="h-40 bg-muted w-full" />
			<div className="p-4 space-y-2">
				<div className="h-4 bg-muted w-3/4 rounded" />
				<div className="h-3 bg-muted w-full rounded" />
				<div className="h-3 bg-muted w-5/6 rounded" />
			</div>
		</div>
	));

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl  font-bold mb-3">Projects</h2>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{shimmerCards}
				</div>
			) : projects.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<FolderOpen className="w-12 h-12 text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground text-sm">
						No projects found. Start adding your awesome work!
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{projects.map((project) => (
						<div
							key={project.id}
							className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors flex flex-col h-fit"
						>
							<FadeInImage
								src={project.image}
								alt={project.title}
								containerClassName="h-34 w-full"
								className="group-hover:scale-105 transition-transform duration-300"
							/>

							<div className="flex flex-col justify-between flex-1 p-4">
								<div className="space-y-2">
									<h3 className="text-base font-bold">{project.title}</h3>{" "}
									<p className="text-sm text-muted-foreground">
										{project.description}
									</p>
								</div>
								{project.technologies?.length > 0 && (
									<div className="flex flex-wrap gap-1.5 py-3 border-t border-border/50 mt-3">
										{project.technologies.map((tech) => (
											<span
												key={tech}
												className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
											>
												{tech}
											</span>
										))}
									</div>
								)}{" "}
								{project.link && project.link !== "#" && (
									<a
										href={project.link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm w-fit mt-2"
									>
										View Project
										<ExternalLink className="h-3 w-3" />
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Projects Dialog */}
			{isEditable && onDialogOpenChange && (
				<ProjectsDialog
					open={dialogOpen}
					onOpenChange={onDialogOpenChange}
					userRef={userRef}
					userDetails={userDetails || null}
					addAlert={addAlert}
					projects={projects}
				/>
			)}
		</section>
	);
}
