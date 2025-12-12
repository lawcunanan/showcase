import {
	DocumentReference,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { AlertType } from "@/providers/alert-context";
import { User } from "@/lib/mock-data";

interface UpdateGalleryParams {
	userRef: DocumentReference | null;
	images: User["galleryImages"];
	imageFile: File | null;
	deletedFiles: User["galleryImages"];
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

const uploadFileToStorage = async (
	file: File,
	path: string,
): Promise<string> => {
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file);
	return await getDownloadURL(storageRef);
};

const deleteFileFromStorage = async (fileUrl: string): Promise<void> => {
	try {
		const storageRef = ref(storage, fileUrl);
		await deleteObject(storageRef);
	} catch (error) {
		console.error("Error deleting file:", error);
	}
};

export const updateGallery = async ({
	userRef,
	images,
	imageFile,
	deletedFiles,
	setLoading,
	addAlert,
}: UpdateGalleryParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	setLoading(true);
	try {
		if (deletedFiles && deletedFiles.length > 0) {
			await Promise.all(
				deletedFiles.map((fileUrl) => deleteFileFromStorage(fileUrl)),
			);
		}

		let updatedImages = [...(images || [])];

		if (imageFile) {
			const imagePath = `users/${userRef.id}/gallery/${Date.now()}_${
				imageFile.name
			}`;
			const imageUrl = await uploadFileToStorage(imageFile, imagePath);
			updatedImages.push(imageUrl);
		}

		await updateDoc(userRef, {
			galleryImages: updatedImages,
			updatedAt: serverTimestamp(),
		});

		addAlert("success", "Gallery updated successfully!");
		return true;
	} catch (error) {
		console.error("Error updating gallery:", error);
		addAlert("danger", "Failed to update gallery");
		return false;
	} finally {
		setLoading(false);
	}
};
