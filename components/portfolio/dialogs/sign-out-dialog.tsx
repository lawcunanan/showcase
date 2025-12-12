"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertType } from "@/providers/alert-context";
import { handleLogout } from "@/controllers/auth/logout";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

export function SignOutDialog({
	open,
	onOpenChange,
	addAlert,
}: SignOutDialogProps) {
	const [btnLoading, setBtnLoading] = useState(false);

	const handleSignOut = () => {
		handleLogout(setBtnLoading, addAlert, () => onOpenChange(false));
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Sign Out</DialogTitle>
					<DialogDescription>
						Are you sure you want to sign out?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleSignOut}
						disabled={btnLoading}
						className="flex items-center"
					>
						{btnLoading ? <LoadingSpinner loading={btnLoading} /> : "Sign Out"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
