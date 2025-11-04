import {
	DocumentReference,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { AlertType } from "@/contexts/alert-context";
import { User } from "@/lib/mock-data";

interface UpdateInformationParams {
	userRef: DocumentReference | null;
	formData: Partial<User>;
	profileImage: File | null;
	cvFile: File | null;
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

const isUrl = (value: string): boolean => {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
};

export const updateInformation = async ({
	userRef,
	formData,
	profileImage,
	cvFile,
	setLoading,
	addAlert,
}: UpdateInformationParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	if (!formData.name || !formData.email) {
		addAlert("danger", "Name and email are required");
		return false;
	}

	setLoading(true);
	try {
		const updateData = { ...formData };

		if (profileImage) {
			const avatarPath = `users/${userRef.id}/avatar/${Date.now()}_${
				profileImage.name
			}`;
			updateData.avatar = await uploadFileToStorage(profileImage, avatarPath);
		} else if (formData.avatar && !isUrl(formData.avatar)) {
			delete updateData.avatar;
		}

		if (cvFile) {
			const cvPath = `users/${userRef.id}/cv/${Date.now()}_${cvFile.name}`;
			updateData.cvUrl = await uploadFileToStorage(cvFile, cvPath);
		} else if (formData.cvUrl && !isUrl(formData.cvUrl)) {
			delete updateData.cvUrl;
		}

		await updateDoc(userRef, {
			...updateData,
			updatedAt: serverTimestamp(),
		});

		addAlert("success", "Information updated successfully!");
		return true;
	} catch (error) {
		console.error("Error updating information:", error);
		addAlert("danger", "Failed to update information");
		return false;
	} finally {
		setLoading(false);
	}
};
