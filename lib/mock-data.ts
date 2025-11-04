export interface User {
	isCurrentUser?: boolean;
	id: string;
	username: string;
	name: string;
	about: string;
	email: string;
	status?: "Active" | "Inactive";
	avatar?: string;
	location?: string;
	title?: string;
	phone?: string;
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	github?: string;
	cvUrl?: string;
	technologies?: string[];
	galleryImages?: string[];
	projects?: Project[];
	achievements?: Achievement[];
}

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	link?: string;
	technologies: string[];
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	date: string;
}
