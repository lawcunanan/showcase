"use client";

import { useState, useEffect } from "react";
import { DocumentReference } from "firebase/firestore";
import { Trash2, Edit2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertType } from "@/providers/alert-context";
import {
	saveAchievement,
	deleteAchievement,
} from "@/controllers/save/saveAchievement";
import type { Achievement, User } from "@/lib/mock-data";

interface AchievementsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userRef: DocumentReference | null;
	addAlert: (type: AlertType, message: string) => void;
	achievements: Achievement[];
}

export function AchievementsDialog({
	open,
	onOpenChange,
	userRef,
	addAlert,
	achievements,
}: AchievementsDialogProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<Achievement>>({
		title: "",
		description: "",
		date: "",
	});

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			resetForm();
		}
	}, [open]);

	const handleDelete = async (id: string) => {
		const success = await deleteAchievement({
			userRef,
			achievementId: id,
			setLoading,
			addAlert,
		});

		if (success) {
			onOpenChange(false);
		}
	};

	const handleEdit = (achievement: Achievement) => {
		setEditingId(achievement.id);

		// Convert formatted date back to YYYY-MM-DD for input
		let dateValue = "";
		if (achievement.date) {
			try {
				const parsedDate = new Date(achievement.date);
				if (!isNaN(parsedDate.getTime())) {
					dateValue = parsedDate.toISOString().split("T")[0];
				}
			} catch (e) {
				dateValue = achievement.date;
			}
		}

		setFormData({
			title: achievement.title,
			description: achievement.description,
			date: dateValue,
		});
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			date: "",
		});
		setEditingId(null);
	};

	const handleSubmit = async () => {
		const success = await saveAchievement({
			userRef,
			formData,
			achievementId: editingId,
			setLoading,
			addAlert,
		});

		if (success) {
			resetForm();
			onOpenChange(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle>Achievements</DialogTitle>
					<DialogDescription>
						Create and manage your achievements
					</DialogDescription>
				</DialogHeader>

				<form
					className="flex flex-col py-6 flex-1 overflow-y-auto"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="space-y-4 overflow-y-auto pr-2 flex-1">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="ach-title">Title</Label>
								<Input
									id="ach-title"
									placeholder="Achievement title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="ach-year">Date</Label>
								<Input
									id="ach-year"
									type="date"
									value={formData.date}
									onChange={(e) =>
										setFormData({ ...formData, date: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ach-description">About</Label>
							<Textarea
								id="ach-description"
								placeholder="Describe your achievement..."
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								className="min-h-[80px]"
							/>
						</div>

						{/* Achievements List */}
						{achievements.length > 0 && (
							<div className="space-y-2 mt-6 pt-6 border-t">
								<h3 className="font-semibold">Achievements</h3>
								<div className="space-y-2">
									{achievements.map((item) => (
										<div
											key={item.id}
											className="flex items-start justify-between p-3 bg-card border rounded-lg"
										>
											<div className="flex-1">
												<div>
													<h4 className="font-semibold text-sm">
														{item.title}
													</h4>
													<p className="text-xs text-muted-foreground">
														{item.description}
													</p>
													<p className="text-xs text-muted-foreground pt-1">
														{item.date}
													</p>
												</div>
											</div>
											<div className="flex gap-2 ml-2 flex-shrink-0">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleEdit(item)}
													className="h-8 w-8 p-0"
													type="button"
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleDelete(item.id)}
													className="h-8 w-8 p-0 text-destructive hover:text-destructive"
													type="button"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</form>

				<DialogFooter className="flex-shrink-0">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={loading}
						className="flex items-center"
					>
						{loading ? (
							<LoadingSpinner loading={loading} />
						) : editingId ? (
							"Update"
						) : (
							"Register"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
