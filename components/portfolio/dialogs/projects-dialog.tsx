"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DocumentReference } from "firebase/firestore";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertType } from "@/contexts/alert-context";
import { saveProject, deleteProject } from "@/controller/save/saveProject";
import type { Project, User } from "@/lib/mock-data";

interface ProjectsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userRef: DocumentReference | null;
	userDetails: User | null;
	addAlert: (type: AlertType, message: string) => void;
	projects: Project[];
}

export function ProjectsDialog({
	open,
	onOpenChange,
	userRef,
	userDetails,
	addAlert,
	projects,
}: ProjectsDialogProps) {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<Project>>({
		title: "",
		description: "",
		link: "",
		image: "",
		technologies: [],
	});

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			resetForm();
		}
	}, [open]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleEdit = (project: Project) => {
		setEditingId(project.id);
		setFormData({
			title: project.title,
			description: project.description,
			link: project.link || "",
			image: project.image,
			technologies: project.technologies || [],
		});
	};

	const handleDelete = async (projectId: string) => {
		const project = projects.find((p) => p.id === projectId);
		const success = await deleteProject({
			userRef,
			projectId,
			imageUrl: project?.image,
			setLoading,
			addAlert,
		});

		if (success) {
			onOpenChange(false);
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			link: "",
			image: "",
			technologies: [],
		});
		setImageFile(null);
		setEditingId(null);
	};

	const handleSubmit = async () => {
		const success = await saveProject({
			userRef,
			formData,
			imageFile,
			projectId: editingId,
			setLoading,
			addAlert,
		});

		if (success) {
			resetForm();
			onOpenChange(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle>Projects</DialogTitle>
					<DialogDescription>Create and manage your projects</DialogDescription>
				</DialogHeader>

				<form
					className="flex flex-col py-6 flex-1 overflow-y-auto"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="space-y-4 overflow-y-auto pr-2 flex-1">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="proj-title">Title</Label>
								<Input
									id="proj-title"
									placeholder="Project title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="proj-image">Project Image</Label>
								<Input
									id="proj-image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="proj-link">Project Link</Label>
								<Input
									id="proj-link"
									type="url"
									placeholder="https://example.com"
									value={formData.link}
									onChange={(e) =>
										setFormData({ ...formData, link: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="proj-description">About</Label>
								<Textarea
									id="proj-description"
									placeholder="Describe your project..."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className="min-h-[80px]"
								/>
							</div>

							<div className="space-y-2">
								<Label>Tech Stack</Label>
								<div className="flex flex-wrap gap-2">
									{userDetails?.technologies?.map((tech, index) => (
										<Button
											key={index}
											size="sm"
											variant={
												formData.technologies?.includes(tech)
													? "default"
													: "outline"
											}
											onClick={() =>
												formData.technologies?.includes(tech)
													? setFormData({
															...formData,
															technologies: formData.technologies?.filter(
																(t) => t !== tech
															),
													  })
													: setFormData({
															...formData,
															technologies: [
																...(formData.technologies || []),
																tech,
															],
													  })
											}
											type="button"
										>
											{tech}
										</Button>
									))}
								</div>
							</div>

							{projects.length > 0 && (
								<div className="space-y-3 mt-6 pt-6 border-t">
									<h3 className="font-semibold">Projects</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{projects.map((item) => (
											<div
												key={item.id}
												className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
											>
												{/* Project Image */}
												<div className="relative h-32 w-full overflow-hidden bg-muted">
													<img
														src={item.image || "/placeholder.svg"}
														alt={item.title}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
													/>
													{/* Action Buttons Overlay */}
													<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
														<Button
															size="sm"
															variant="secondary"
															onClick={() => handleEdit(item)}
															className="h-7 w-7 p-0 bg-background/90 hover:bg-background"
															type="button"
														>
															<Edit2 className="h-3 w-3" />
														</Button>
														<Button
															size="sm"
															variant="secondary"
															className="h-7 w-7 p-0 bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
															type="button"
															onClick={() => handleDelete(item.id)}
														>
															<Trash2 className="h-3 w-3" />
														</Button>
													</div>
												</div>

												{/* Project Details */}
												<div className="p-3 space-y-2">
													<h4 className="font-semibold text-sm line-clamp-1">
														{item.title}
													</h4>
													<p className="text-xs text-muted-foreground line-clamp-2">
														{item.description}
													</p>

													{/* Technologies */}
													{item.technologies &&
														item.technologies.length > 0 && (
															<div className="flex flex-wrap gap-1 pt-1">
																{item.technologies.slice(0, 3).map((tech) => (
																	<span
																		key={tech}
																		className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded"
																	>
																		{tech}
																	</span>
																))}
																{item.technologies.length > 3 && (
																	<span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">
																		+{item.technologies.length - 3}
																	</span>
																)}
															</div>
														)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</form>

				<DialogFooter className="flex-shrink-0">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={loading}
						className="flex items-center"
					>
						{loading ? (
							<LoadingSpinner loading={loading} />
						) : editingId ? (
							"Update"
						) : (
							"Register"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
