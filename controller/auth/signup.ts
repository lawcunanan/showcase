import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AlertType } from "@/contexts/alert-context";

interface SignUpParams {
	name: string;
	username: string;
	email: string;
	password: string;
	about: string;
	confirmationCode: string;
	setLoading: (loading: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

export const handleSignUp = async ({
	name,
	username,
	email,
	password,
	about,
	confirmationCode,
	setLoading,
	addAlert,
}: SignUpParams): Promise<boolean> => {
	// Validate confirmation code
	const correctCode = process.env.NEXT_PUBLIC_MYPASSWORD;
	if (confirmationCode !== correctCode) {
		addAlert("danger", "Invalid confirmation code. Please contact admin.");
		return false;
	}

	// Validate required fields
	if (!name || !username || !email || !password || !about) {
		addAlert("danger", "Please fill in all fields");
		return false;
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		addAlert("danger", "Please enter a valid email address");
		return false;
	}

	// Validate password length
	if (password.length < 6) {
		addAlert("danger", "Password must be at least 6 characters");
		return false;
	}

	// Validate username (alphanumeric and underscore only)
	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(username)) {
		addAlert(
			"danger",
			"Username can only contain letters, numbers, and underscores"
		);
		return false;
	}

	setLoading(true);
	try {
		// Create user authentication
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Create user document in Firestore
		const userRef = doc(db, "users", user.uid);
		await setDoc(userRef, {
			username: username.toLowerCase(),
			name,
			email,
			about,
			avatar: "",
			cvUrl: "",
			title: "",
			location: "",
			phone: "",
			technologies: [],
			galleryImages: [],
			github: "",
			linkedin: "",
			twitter: "",
			website: "",
			status: "Inactive",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		addAlert("success", "Account created successfully!");
		return true;
	} catch (error: any) {
		console.error("Error creating account:", error);

		// Handle specific Firebase errors
		if (error.code === "auth/email-already-in-use") {
			addAlert("danger", "Email address is already in use");
		} else if (error.code === "auth/weak-password") {
			addAlert("danger", "Password is too weak");
		} else {
			addAlert("danger", error.message || "Failed to create account");
		}
		return false;
	} finally {
		setLoading(false);
	}
};
