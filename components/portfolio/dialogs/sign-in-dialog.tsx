"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAlert } from "@/contexts/alert-context";
import { handleLogin } from "@/controller/auth/login";

interface SignInDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { addAlert } = useAlert();

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			setEmail("");
			setPassword("");
		}
	}, [open]);

	const handleSignIn = () => {
		if (email && password) {
			handleLogin(email, password, setLoading, addAlert, () =>
				onOpenChange(false)
			);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>
						Enter your credentials to access your portfolio
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-6">
					<div className="space-y-2">
						<Label htmlFor="signin-email">Email</Label>
						<Input
							id="signin-email"
							type="email"
							placeholder="your.email@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSignIn()}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="signin-password">Password</Label>
						<Input
							id="signin-password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSignIn()}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSignIn}
						disabled={loading}
						className="flex items-center"
					>
						{loading ? <LoadingSpinner loading={loading} /> : "Sign In"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
