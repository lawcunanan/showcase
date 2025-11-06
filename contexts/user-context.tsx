"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import Lottie from "lottie-react";
import authAnimation from "@/public/lottie/authLoading.json";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import {
	collection,
	doc,
	onSnapshot,
	query,
	where,
	getDocs,
	DocumentReference,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAlert } from "@/contexts/alert-context";
import { limit } from "firebase/firestore";
import type { User } from "@/lib/mock-data";

interface UserContextAuthType {
	user: FirebaseUser | null;
	userDetails: User | null;
	userRef: DocumentReference | null;
	loading: boolean;
}

const UserContextAuth = createContext<UserContextAuthType | undefined>(
	undefined
);

export function UserContextAuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const params = useParams();
	const pathname = usePathname();
	const username = params?.username as string | undefined;
	const { addAlert } = useAlert();

	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [userDetails, setUserDetails] = useState<User | null>(null);
	const [userRef, setUserRef] = useState<DocumentReference | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribeUserDoc = () => {};

		const subscribeToUserDoc = (uid: string, logged: boolean) => {
			const ref = doc(db, "users", uid);
			setUserRef(ref);

			return onSnapshot(
				ref,
				(docSnap) => {
					if (docSnap.exists()) {
						const data = docSnap.data() as User;

						if (data.status === "Inactive") {
							addAlert(
								"danger",
								"Firebase free trial has ended. Your portfolio is temporarily disabled until the Firebase subscription is reactivated."
							);
							setUserDetails(null);
							setLoading(false);
							router.push("/firebase-reactivate");
							return;
						}

						setUserDetails({
							id: docSnap.id,
							isCurrentUser: logged && docSnap.id === uid,
							...(docSnap.data() as Omit<User, "id" | "isCurrentUser">),
						});

						if (data.username) router.push(`/portfolio/${data.username}`);
					} else {
						addAlert("danger", "User document not found.");
						setUserDetails(null);
					}
					setLoading(false);
				},
				(error) => {
					addAlert("danger", "Error fetching user details: " + error.message);
					setUserDetails(null);
					setLoading(false);
					router.push("/");
				}
			);
		};

		const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
			unsubscribeUserDoc();
			setUser(currentUser);
			setLoading(true);

			if (currentUser) {
				unsubscribeUserDoc = subscribeToUserDoc(currentUser.uid, true);
			} else if (username) {
				try {
					const usersRef = collection(db, "users");
					const q = query(
						usersRef,
						where("username", "==", username),
						limit(1)
					);
					const snapshot = await getDocs(q);

					if (!snapshot.empty) {
						const userDoc = snapshot.docs[0];
						unsubscribeUserDoc = subscribeToUserDoc(userDoc.id, false);
					} else {
						addAlert("danger", "User not found.");
						setLoading(false);
						router.push("/");
					}
				} catch (error: any) {
					addAlert(
						"danger",
						"Error fetching user by username: " + error.message
					);
					setLoading(false);
					router.push("/");
				}
			} else {
				setLoading(false);
				if (pathname !== "/firebase-reactivate") router.push("/");
			}
		});

		return () => {
			unsubscribeAuth();
			unsubscribeUserDoc();
		};
	}, [router, addAlert, username]);

	return (
		<UserContextAuth.Provider value={{ user, userDetails, userRef, loading }}>
			{loading ? (
				<div className="flex items-center justify-center h-screen w-full bg-background">
					<Lottie animationData={authAnimation} loop className="w-78 h-78" />
				</div>
			) : (
				children
			)}
		</UserContextAuth.Provider>
	);
}

export function useUserAuth() {
	const context = useContext(UserContextAuth);
	if (!context) {
		throw new Error("useUserAuth must be used within UserContextAuthProvider");
	}
	return context;
}
