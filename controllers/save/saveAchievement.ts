import {
	DocumentReference,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	collection,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertType } from "@/providers/alert-context";
import { Achievement } from "@/lib/mock-data";

interface SaveAchievementParams {
	userRef: DocumentReference | null;
	formData: Partial<Achievement>;
	achievementId?: string | null;
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

interface DeleteAchievementParams {
	userRef: DocumentReference | null;
	achievementId: string;
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

export const saveAchievement = async ({
	userRef,
	formData,
	achievementId,
	setLoading,
	addAlert,
}: SaveAchievementParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	if (!formData.title || !formData.description || !formData.date) {
		addAlert("danger", "Please fill in all fields");
		return false;
	}

	setLoading(true);
	try {
		const achievementsCollection = collection(db, "achievements");

		// Convert date string to Firestore Timestamp
		const dateTimestamp = formData.date
			? Timestamp.fromDate(new Date(formData.date))
			: null;

		const achievementData = {
			title: formData.title,
			description: formData.description,
			date: dateTimestamp,
			usID: userRef,
		};

		if (achievementId) {
			const achievementRef = doc(achievementsCollection, achievementId);
			await updateDoc(achievementRef, {
				...achievementData,
				updatedAt: serverTimestamp(),
			});
			addAlert("success", "Achievement updated successfully!");
		} else {
			await addDoc(achievementsCollection, {
				...achievementData,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			addAlert("success", "Achievement registered successfully!");
		}

		return true;
	} catch (error) {
		console.error("Error saving achievement:", error);
		addAlert("danger", "Failed to save achievement");
		return false;
	} finally {
		setLoading(false);
	}
};

export const deleteAchievement = async ({
	userRef,
	achievementId,
	setLoading,
	addAlert,
}: DeleteAchievementParams) => {
	if (!userRef) {
		addAlert("danger", "User reference not found");
		return false;
	}

	if (!achievementId) {
		addAlert("danger", "Achievement ID not found");
		return false;
	}

	setLoading(true);
	try {
		const achievementRef = doc(db, "achievements", achievementId);
		await deleteDoc(achievementRef);
		addAlert("success", "Achievement deleted successfully!");
		return true;
	} catch (error) {
		console.error("Error deleting achievement:", error);
		addAlert("danger", "Failed to delete achievement");
		return false;
	} finally {
		setLoading(false);
	}
};
