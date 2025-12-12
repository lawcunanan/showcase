"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DocumentReference } from "firebase/firestore";
import { Trash2 } from "lucide-react";
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
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertType } from "@/providers/alert-context";
import { updateGallery } from "@/controllers/update/updateGallery";
import type { User } from "@/lib/mock-data";

interface GalleryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userRef: DocumentReference | null;
	userdetails?: User | null;
	addAlert: (type: AlertType, message: string) => void;
}

export function GalleryDialog({
	open,
	onOpenChange,
	userRef,
	userdetails,
	addAlert,
}: GalleryDialogProps) {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [images, setImages] = useState<User["galleryImages"]>(
		userdetails?.galleryImages || [],
	);
	const [deletedImages, setDeletedImages] = useState<User["galleryImages"]>([]);
	const [loading, setLoading] = useState(false);

	// Reset form when dialog opens/closes
	useEffect(() => {
		if (open && userdetails) {
			setImages(userdetails?.galleryImages || []);
			setDeletedImages([]);
			setImageFile(null);
		} else if (!open) {
			setImages([]);
			setDeletedImages([]);
			setImageFile(null);
		}
	}, [open, userdetails]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			// Check if adding this image would exceed the limit
			const currentImageCount = images?.length || 0;
			if (currentImageCount >= 10) {
				addAlert("danger", "Maximum 10 images allowed in gallery");
				e.target.value = ""; // Reset input
				return;
			}
			setImageFile(e.target.files[0]);
		}
	};

	const handleDeleteImage = (imageUrl: string, index: number) => {
		setImages((prev) => prev?.filter((_, i) => i !== index) || []);
		setDeletedImages((prev) => [...(prev || []), imageUrl]);
	};

	const handleDone = async () => {
		const success = await updateGallery({
			userRef,
			images,
			imageFile,
			deletedFiles: deletedImages,
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
				<DialogHeader className="flex-shrink-0">
					<DialogTitle>Gallery</DialogTitle>
					<DialogDescription>
						Upload and manage your gallery images
					</DialogDescription>
				</DialogHeader>

				<form
					className="flex flex-col py-6 flex-1 overflow-y-auto"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="space-y-4 overflow-y-auto pr-2 flex-1">
						<h3 className="font-semibold">Upload Images</h3>
						<div className="space-y-2">
							<Label htmlFor="gallery-image">Upload Image</Label>
							<Input
								id="gallery-image"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
							/>
							{imageFile && (
								<p className="text-sm text-muted-foreground">
									{imageFile.name}
								</p>
							)}
						</div>

						{images && images.length > 0 && (
							<div className="space-y-3 mt-6 pt-6 border-t">
								<h3 className="font-semibold">Gallery Items</h3>
								<div className="grid grid-cols-2 gap-4">
									{images.map((image, index) => (
										<div
											key={index}
											className="relative group bg-muted rounded-lg overflow-hidden"
										>
											<img
												src={image || "/placeholder.svg"}
												alt={"Gallery Image"}
												className="w-full h-32 object-cover"
											/>
											<Button
												size="sm"
												variant="ghost"
												className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-destructive/80 hover:bg-destructive text-white"
												type="button"
												onClick={() => handleDeleteImage(image!, index)}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
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
						onClick={handleDone}
						disabled={loading}
						className="flex items-center"
					>
						{loading ? <LoadingSpinner loading={loading} /> : "Done"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
