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
						about: data.about || "",
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
