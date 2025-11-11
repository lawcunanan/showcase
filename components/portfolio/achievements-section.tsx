"use client";

import type { Achievement } from "@/lib/mock-data";
import { DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAchievements } from "@/controller/get/getAchievements";
import { useAlert } from "@/contexts/alert-context";
import { AchievementsDialog } from "@/components/portfolio/dialogs/achievements-dialog";
import { AlertType } from "@/contexts/alert-context";
import { Award } from "lucide-react";

interface AchievementsSectionProps {
	userRef: DocumentReference;
	isEditable?: boolean;
	dialogOpen?: boolean;
	onDialogOpenChange?: (open: boolean) => void;
	addAlert?: (type: AlertType, message: string) => void;
}

export function AchievementsSection({
	userRef,
	isEditable = false,
	dialogOpen = false,
	onDialogOpenChange,
	addAlert: addAlertProp,
}: AchievementsSectionProps) {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [loading, setLoading] = useState(true);
	const { addAlert: addAlertContext } = useAlert();
	const addAlert = addAlertProp || addAlertContext;

	useEffect(() => {
		const unsubscribe = getAchievements(
			userRef,
			setAchievements,
			setLoading,
			addAlert
		);
		return () => unsubscribe();
	}, [userRef, addAlert]);

	const shimmerAchievements = Array.from({ length: 3 }).map((_, i) => (
		<div key={i} className="flex items-start gap-4 animate-pulse">
			<div className="flex flex-col items-center">
				<div className="w-3 h-3 rounded-full bg-muted" />
				{i < 2 && <div className="w-0.5 h-12 bg-muted/70 my-2" />}
			</div>
			<div className="flex-1 space-y-2">
				<div className="h-4 bg-muted w-1/2 rounded" />
				<div className="h-3 bg-muted w-3/4 rounded" />
				<div className="h-2 bg-muted w-1/3 rounded" />
			</div>
		</div>
	));

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl  font-bold mb-3">Achievements</h2>
			</div>

			{loading ? (
				<div className="space-y-6">{shimmerAchievements}</div>
			) : achievements.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<Award className="w-12 h-12 text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground text-sm">
						No achievements yet. Keep striving for greatness!
					</p>
				</div>
			) : (
				<div className="max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/80">
					<div className="space-y-6">
						{achievements.map((achievement, index) => (
							<div
								key={achievement.id}
								className="flex items-start gap-4 group"
							>
								<div className="flex flex-col items-center">
									<div
										className={`w-3 h-3 rounded-full flex-shrink-0 ${
											index === 0 ? "bg-primary" : "bg-border"
										}`}
									/>
									{index < achievements.length - 1 && (
										<div className="w-0.5 h-12 bg-border/50 my-2" />
									)}
								</div>

								<div className="flex-1 min-w-0 pt-0.5">
									<h3 className="font-bold text-foreground text-base">
										{achievement.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{achievement.description}
									</p>
									<p className="text-xs text-muted-foreground font-medium mt-2">
										{achievement.date}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Achievements Dialog */}
			{isEditable && onDialogOpenChange && (
				<AchievementsDialog
					open={dialogOpen}
					onOpenChange={onDialogOpenChange}
					userRef={userRef}
					addAlert={addAlert}
					achievements={achievements}
				/>
			)}
		</section>
	);
}
