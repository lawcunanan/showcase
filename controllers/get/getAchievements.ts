import {
	onSnapshot,
	query,
	where,
	orderBy,
	collection,
	DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Achievement } from "@/lib/mock-data";

export function getAchievements(
	usRef: DocumentReference,
	setAchievementData: (data: Achievement[]) => void,
	setLoading: (loading: boolean) => void,
	addAlert: (type: "success" | "danger", message: string) => void
) {
	setLoading(true);
	try {
		const achievementsRef = collection(db, "achievements");

		const q = query(
			achievementsRef,
			where("usID", "==", usRef),
			orderBy("date", "desc")
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const achievements: Achievement[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					let dateString = "";

					// Handle Timestamp conversion
					if (data.date && typeof data.date.toDate === "function") {
						dateString = data.date.toDate().toLocaleDateString("en-US", {
							month: "long",
							day: "2-digit",
							year: "numeric",
						});
					} else if (typeof data.date === "string") {
						// Fallback for old string dates
						dateString = data.date;
					}

					return {
						id: doc.id,
						title: data.title,
						description: data.description,
						date: dateString,
					};
				});

				setAchievementData(achievements);
				setLoading(false);
			},
			(error) => {
				addAlert("danger", error?.message || "Something went wrong.");
				console.error(error.message);
				setLoading(false);
			}
		);

		return unsubscribe;
	} catch (error: any) {
		addAlert("danger", error?.message || "Something went wrong.");
		setLoading(false);
		return () => {};
	}
}
