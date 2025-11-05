import {
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/lib/mock-data";

export function getActiveUsers(
	setUsers: (users: User[]) => void,
	setLoading: (loading: boolean) => void
) {
	setLoading(true);
	try {
		const usersRef = collection(db, "users");

		const q = query(
			usersRef,
			where("status", "==", "Active"),
			orderBy("name", "asc")
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const users: User[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						username: data.username,
						name: data.name,
						email: data.email,
						avatar: data.avatar || "",
						cvUrl: data.cvUrl || "",
						title: data.title || "",
						location: data.location || "",
						about: data.about || "",
						phone: data.phone || "",
						technologies: data.technologies || [],
						galleryImages: data.galleryImages || [],
						github: data.github || "",
						linkedin: data.linkedin || "",
						twitter: data.twitter || "",
						website: data.website || "",
						status: data.status,
						projects: [],
						achievements: [],
						isCurrentUser: false,
					};
				});

				setUsers(users);
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching active users:", error);
				setLoading(false);
			}
		);

		return unsubscribe;
	} catch (error: any) {
		console.error("Error setting up active users listener:", error);
		setLoading(false);
		return () => {};
	}
}
