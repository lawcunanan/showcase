"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading";
import { handleSignUp } from "@/controllers/auth/signup";
import { AlertType } from "@/providers/alert-context";

interface SignUpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addAlert: (type: AlertType, message: string) => void;
}

export function SignUpDialog({
	open,
	onOpenChange,
	addAlert,
}: SignUpDialogProps) {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [about, setAbout] = useState("");
	const [confirmationCode, setConfirmationCode] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open) {
			setName("");
			setUsername("");
			setEmail("");
			setPassword("");
			setAbout("");
			setConfirmationCode("");
		}
	}, [open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const success = await handleSignUp({
			name,
			username,
			email,
			password,
			about,
			confirmationCode,
			setLoading,
			addAlert,
		});

		if (success) {
			onOpenChange(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Create Portfolio Account</DialogTitle>
					<DialogDescription>
						Fill in your details to create a new portfolio account
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="space-y-4 overflow-y-auto flex-1 pr-2"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="signup-name">
								Full Name <span className="text-destructive">*</span>
							</Label>
							<Input
								id="signup-name"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="signup-username">
								Username <span className="text-destructive">*</span>
							</Label>
							<Input
								id="signup-username"
								placeholder="johndoe"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<p className="text-xs text-muted-foreground">
								Only letters, numbers, and underscores
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="signup-email">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							id="signup-email"
							type="email"
							placeholder="john@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="signup-password">
							Password <span className="text-destructive">*</span>
						</Label>
						<Input
							id="signup-password"
							type="password"
							placeholder="Minimum 6 characters"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="signup-about">
							About <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="signup-about"
							placeholder="Tell us about yourself..."
							rows={4}
							value={about}
							onChange={(e) => setAbout(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="signup-code">
							Confirmation Code <span className="text-destructive">*</span>
						</Label>
						<Input
							id="signup-code"
							type="password"
							placeholder="Enter admin confirmation code"
							value={confirmationCode}
							onChange={(e) => setConfirmationCode(e.target.value)}
							required
						/>
						<p className="text-xs text-muted-foreground">
							Contact admin to get the confirmation code
						</p>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading} className="flex-1">
							{loading ? (
								<LoadingSpinner loading={loading} />
							) : (
								"Create Account"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
