"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DocumentReference } from "firebase/firestore";
import { X } from "lucide-react";
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
import { updateInformation } from "@/controller/update/updateInformation";
import { User } from "@/lib/mock-data";

interface InformationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userRef: DocumentReference | null;
	userdetails: User | null;
	addAlert: (type: AlertType, message: string) => void;
}

export function InformationDialog({
	open,
	onOpenChange,
	userRef,
	userdetails,
	addAlert,
}: InformationDialogProps) {
	const [formData, setFormData] = useState<Partial<User>>({
		name: "",
		email: "",
		about: "",
		avatar: "",
		location: "",
		title: "",
		phone: "",
		facebook: "",
		instagram: "",
		linkedin: "",
		github: "",
		cvUrl: "",
		technologies: [],
	});
	const [techInput, setTechInput] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [cvFile, setCvFile] = useState<File | null>(null);

	useEffect(() => {
		if (open && userdetails) {
			setFormData({
				name: userdetails.name || "",
				email: userdetails.email || "",
				about: userdetails.about || "",
				avatar: userdetails.avatar || "",
				location: userdetails.location || "",
				title: userdetails.title || "",
				phone: userdetails.phone || "",
				facebook: userdetails.facebook || "",
				instagram: userdetails.instagram || "",
				linkedin: userdetails.linkedin || "",
				github: userdetails.github || "",
				cvUrl: userdetails.cvUrl || "",
				technologies: userdetails.technologies || [],
			});
		} else if (!open) {
			// Reset form when dialog closes
			setFormData({
				name: "",
				email: "",
				about: "",
				avatar: "",
				location: "",
				title: "",
				phone: "",
				facebook: "",
				instagram: "",
				linkedin: "",
				github: "",
				cvUrl: "",
				technologies: [],
			});
			setProfileImage(null);
			setCvFile(null);
			setTechInput("");
		}
	}, [open, userdetails]);

	const handleInputChange = (field: keyof User, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAddTech = () => {
		if (
			techInput.trim() &&
			!formData.technologies?.includes(techInput.trim())
		) {
			setFormData((prev) => ({
				...prev,
				technologies: [...(prev.technologies || []), techInput.trim()],
			}));
			setTechInput("");
		}
	};

	const handleRemoveTech = (tech: string) => {
		setFormData((prev) => ({
			...prev,
			technologies: prev.technologies?.filter((t) => t !== tech) || [],
		}));
	};

	const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setProfileImage(e.target.files[0]);
		}
	};

	const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setCvFile(e.target.files[0]);
		}
	};

	const handleSave = async () => {
		const success = await updateInformation({
			userRef,
			formData,
			profileImage,
			cvFile,
			setLoading,
			addAlert,
		});

		if (success) {
			onOpenChange(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Edit Your Information</DialogTitle>
				</DialogHeader>
				<div className="overflow-y-auto flex-1 pr-2">
					{" "}
					<div className="space-y-6 py-6">
						<div className="space-y-4 pb-6 border-b">
							<h3 className="font-semibold text-lg">Profile Information</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Profile Picture</Label>
									<Input
										type="file"
										accept="image/*"
										onChange={handleProfileImageChange}
									/>
									{profileImage && (
										<p className="text-sm text-muted-foreground">
											{profileImage.name}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="Your full name"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="your.email@example.com"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										placeholder="Your professional title"
										value={formData.title}
										onChange={(e) => handleInputChange("title", e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="location">Location</Label>
									<Input
										id="location"
										placeholder="City, Country"
										value={formData.location}
										onChange={(e) =>
											handleInputChange("location", e.target.value)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Contact Number</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="+1 (555) 000-0000"
										value={formData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div className="space-y-4 pb-6 border-b">
							<h3 className="font-semibold text-lg">About & CV</h3>
							<div className="space-y-2">
								<Label htmlFor="about">About</Label>
								<Textarea
									id="about"
									placeholder="Tell us about yourself..."
									className="min-h-[100px]"
									value={formData.about}
									onChange={(e) => handleInputChange("about", e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label>CV File Upload</Label>
								<Input
									type="file"
									accept=".pdf,.doc,.docx"
									onChange={handleCvChange}
								/>
								{cvFile && (
									<p className="text-sm text-muted-foreground">{cvFile.name}</p>
								)}
							</div>
						</div>

						<div className="space-y-4 pb-6 border-b">
							<h3 className="font-semibold text-lg">Social Links</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="instagram">Instagram</Label>
									<Input
										id="instagram"
										placeholder="@yourhandle"
										value={formData.instagram}
										onChange={(e) =>
											handleInputChange("instagram", e.target.value)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="facebook">Facebook</Label>
									<Input
										id="facebook"
										placeholder="Your profile URL"
										value={formData.facebook}
										onChange={(e) =>
											handleInputChange("facebook", e.target.value)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="linkedin">LinkedIn</Label>
									<Input
										id="linkedin"
										placeholder="Your profile URL"
										value={formData.linkedin}
										onChange={(e) =>
											handleInputChange("linkedin", e.target.value)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="github">GitHub</Label>
									<Input
										id="github"
										placeholder="Your profile URL"
										value={formData.github}
										onChange={(e) =>
											handleInputChange("github", e.target.value)
										}
									/>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-semibold text-lg">Tech Stack</h3>
							<div className="flex gap-2">
								<Input
									placeholder="Add a technology"
									value={techInput}
									onChange={(e) => setTechInput(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
								/>
								<Button onClick={handleAddTech} variant="outline">
									Add
								</Button>
							</div>

							{formData.technologies && formData.technologies.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{formData.technologies.map((tech: string) => (
										<div
											key={tech}
											className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
										>
											{tech}
											<button
												onClick={() => handleRemoveTech(tech)}
												className="hover:opacity-70 transition-opacity"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={loading}
							className="flex items-center"
						>
							{loading ? <LoadingSpinner loading={loading} /> : "Save Changes"}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
