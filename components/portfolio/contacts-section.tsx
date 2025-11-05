import type { User } from "@/lib/mock-data";
import { Mail, Instagram, Facebook, Linkedin, Github } from "lucide-react";

export function ContactsSection({ user }: { user: User }) {
	const contacts = [
		{
			icon: Mail,
			link: user.email ? `mailto:${user.email}` : undefined,
			label: "Email",
		},
		{
			icon: Instagram,
			link: user.instagram,
			label: "Instagram",
		},
		{
			icon: Facebook,
			link: user.facebook,
			label: "Facebook",
		},
		{
			icon: Linkedin,
			link: user.linkedin,
			label: "LinkedIn",
		},
		{
			icon: Github,
			link: user.github,
			label: "GitHub",
		},
	].filter((contact) => contact.link);

	if (contacts.length === 0) {
		return null;
	}

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl lg:text-3xl font-bold mb-3">Contact</h2>
			</div>

			<div className="flex gap-4">
				{contacts.map((contact) => {
					if (!contact.link) return null;
					const Icon = contact.icon;
					return (
						<a
							key={contact.label}
							href={contact.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-colors"
							title={contact.label}
						>
							<Icon className="h-5 w-5" />
						</a>
					);
				})}
			</div>
		</section>
	);
}
