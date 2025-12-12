"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const handleLogout = async (
	setBtnLoading: (loading: boolean) => void,
	addAlert: (type: "success" | "danger", message: string) => void,
	onClose?: () => void
): Promise<void> => {
	try {
		setBtnLoading(true);

		await signOut(auth);

		addAlert("success", "Logout successful! See you soon, Lawrence.");
		onClose?.();
	} catch (error: any) {
		let errorMessage = "Logout failed. Please try again.";

		if (error.code === "auth/network-request-failed") {
			errorMessage =
				"Network error. Please check your connection and try again.";
		}

		addAlert("danger", errorMessage);
	} finally {
		setBtnLoading(false);
	}
};
