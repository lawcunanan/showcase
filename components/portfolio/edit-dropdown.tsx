"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface EditDropdownProps {
	onYourInformation: () => void;
	onAchievements: () => void;
	onProjects: () => void;
	onGallery: () => void;
}

export function EditDropdown({
	onYourInformation,
	onAchievements,
	onProjects,
	onGallery,
}: EditDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="rounded-full bg-transparent"
				>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="mt-6">
				<DropdownMenuItem onClick={onYourInformation}>
					Your Information
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onAchievements}>
					Achievements
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onProjects}>Projects</DropdownMenuItem>
				<DropdownMenuItem onClick={onGallery}>Gallery</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
