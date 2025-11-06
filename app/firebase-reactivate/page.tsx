import Link from "next/link";

export const metadata = {
	title: "Reactivate Firebase Subscription",
};

export default function FirebaseReactivatePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-xl text-center">
				<img
					src="/firebase-logo.svg"
					alt="Firebase"
					className="mx-auto mb-6 w-40 h-40"
				/>

				<h1 className="text-4xl font-bold text-orange-400 mb-3">
					Firebase free trial ended
				</h1>

				<p className="text-sm text-muted-foreground mb-6">
					Your Firebase project billing has lapsed or the free trial has ended.
					To restore access to your portfolio and keep your site online, please
					reactivate billing for your Firebase project.
				</p>
			</div>
		</main>
	);
}
