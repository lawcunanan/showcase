import {
	DocumentReference,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	collection,
	serverTimestamp,
} from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { AlertType } from "@/contexts/alert-context";
import { Project } from "@/lib/mock-data";

interface SaveProjectParams {
	userRef: DocumentReference | null;
	formData: Partial<Project>;
	imageFile: File | null;
	projectId?: string | null;
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

interface DeleteProjectParams {
	userRef: DocumentReference | null;
	projectId: string;
	imageUrl?: string;
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

const uploadFileToStorage = async (
	file: File,
	path: string
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

const isUrl = (value: string): boolean => {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
};

export const saveProject = async ({
	userRef,
	formData,
	imageFile,
	projectId,
	setLoading,
	addAlert,
}: SaveProjectParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	if (!formData.title || !formData.description) {
		addAlert("danger", "Title and description are required");
		return false;
	}

	setLoading(true);
	try {
		const projectsCollection = collection(db, "projects");
		const projectData = { ...formData };

		if (imageFile) {
			const imagePath = `users/${userRef.id}/projects/${Date.now()}_${
				imageFile.name
			}`;
			projectData.image = await uploadFileToStorage(imageFile, imagePath);
		} else if (formData.image && !isUrl(formData.image)) {
			delete projectData.image;
		}

		if (projectId) {
			const projectRef = doc(projectsCollection, projectId);
			await updateDoc(projectRef, {
				...projectData,
				usID: userRef,
				updatedAt: serverTimestamp(),
			});
			addAlert("success", "Project updated successfully!");
		} else {
			await addDoc(projectsCollection, {
				...projectData,
				usID: userRef,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			addAlert("success", "Project registered successfully!");
		}

		return true;
	} catch (error) {
		console.error("Error saving project:", error);
		addAlert("danger", "Failed to save project");
		return false;
	} finally {
		setLoading(false);
	}
};

export const deleteProject = async ({
	userRef,
	projectId,
	imageUrl,
	setLoading,
	addAlert,
}: DeleteProjectParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	if (!projectId) {
		addAlert("danger", "Project ID not found");
		return false;
	}

	setLoading(true);
	try {
		if (imageUrl && isUrl(imageUrl)) {
			await deleteFileFromStorage(imageUrl);
		}

		const projectRef = doc(db, "projects", projectId);
		await deleteDoc(projectRef);

		addAlert("success", "Project deleted successfully!");
		return true;
	} catch (error) {
		console.error("Error deleting project:", error);
		addAlert("danger", "Failed to delete project");
		return false;
	} finally {
		setLoading(false);
	}
};
