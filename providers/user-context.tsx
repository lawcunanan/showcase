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
import { useAlert } from "@/providers/alert-context";
import { limit } from "firebase/firestore";
import type { User } from "@/lib/mock-data";

interface UserContextAuthType {
	user: FirebaseUser | null;
	userDetails: User | null;
	userRef: DocumentReference | null;
	loading: boolean;
}

const UserContextAuth = createContext<UserContextAuthType | undefined>(
	undefined,
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
	const [redirectTo, setRedirectTo] = useState<string | null>(null);

	const subscribeToUserDoc = (uid: string, logged: boolean) => {
		const ref = doc(db, "users", uid);
		setUserRef(ref);

		return onSnapshot(
			ref,
			(docSnap) => {
				if (!docSnap.exists()) {
					addAlert("danger", "User document not found.");
					setUserDetails(null);
					return;
				}

				const data = docSnap.data() as User;

				if (data.status === "Inactive") {
					addAlert(
						"danger",
						"Firebase free trial has ended. Your portfolio is temporarily disabled until the Firebase subscription is reactivated.",
					);
					setUserDetails(null);
					setRedirectTo("/firebase-reactivate");
					return;
				}

				setUserDetails({
					id: docSnap.id,
					isCurrentUser: logged && docSnap.id === uid,
					...(docSnap.data() as Omit<User, "id" | "isCurrentUser">),
				});

				if (data.username) {
					setRedirectTo(`/portfolio/${data.username}`);
				}

				setLoading(false);
			},
			(error) => {
				addAlert("danger", "Error fetching user details: " + error.message);
				setUserDetails(null);
				setLoading(false);
				setRedirectTo("/");
			},
		);
	};

	useEffect(() => {
		let unsubscribeUserDoc = () => {};

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
						limit(1),
					);
					const snapshot = await getDocs(q);

					if (!snapshot.empty) {
						const userDoc = snapshot.docs[0];
						unsubscribeUserDoc = subscribeToUserDoc(userDoc.id, false);
					} else {
						addAlert("danger", "User not found.");
						setRedirectTo("/");
					}
				} catch (error: any) {
					addAlert(
						"danger",
						"Error fetching user by username: " + error.message,
					);
					setRedirectTo("/");
				}
			} else {
				if (pathname !== "/firebase-reactivate") setRedirectTo("/");
				setLoading(false);
			}
		});

		return () => {
			unsubscribeAuth();
			unsubscribeUserDoc();
		};
	}, [username]);

	useEffect(() => {
		if (redirectTo && pathname !== redirectTo) {
			router.push(redirectTo);
		}
	}, [redirectTo, pathname, router]);

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
	if (!context)
		throw new Error("useUserAuth must be used within UserContextAuthProvider");
	return context;
}
