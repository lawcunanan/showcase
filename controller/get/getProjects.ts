import {
	onSnapshot,
	query,
	where,
	orderBy,
	collection,
	type DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Project } from "@/lib/mock-data";

export function getProjects(
	usRef: DocumentReference,
	setProjectData: (data: Project[]) => void,
	setLoading: (loading: boolean) => void,
	addAlert: (type: "success" | "danger", message: string) => void
) {
	setLoading(true);
	try {
		const projectsRef = collection(db, "projects");

		const q = query(
			projectsRef,
			where("usID", "==", usRef),
			orderBy("title", "asc")
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const projects: Project[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						title: data.title,
						description: data.description,
						image: data.image,
						link: data.link || "",
						technologies: Array.isArray(data.technologies)
							? data.technologies
							: [],
					};
				});

				setProjectData(projects);
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
