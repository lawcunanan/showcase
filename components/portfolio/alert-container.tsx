"use client";

import { useAlert, type AlertType } from "@/providers/alert-context";
import { AlertCircle, CheckCircle, AlertTriangle, X } from "lucide-react";

export function AlertContainer() {
	const { alerts, removeAlert } = useAlert();

	const getAlertStyles = (type: AlertType) => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100";
			case "danger":
				return "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100";
			case "warning":
				return "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100";
		}
	};

	const getIcon = (type: AlertType) => {
		switch (type) {
			case "success":
				return <CheckCircle className="h-5 w-5" />;
			case "danger":
				return <AlertCircle className="h-5 w-5" />;
			case "warning":
				return <AlertTriangle className="h-5 w-5" />;
		}
	};

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
			{alerts.map((alert) => (
				<div
					key={alert.id}
					className={`flex items-start gap-3 p-4 border rounded-lg ${getAlertStyles(
						alert.type,
					)} animate-in fade-in slide-in-from-top-2 duration-300`}
				>
					{getIcon(alert.type)}
					<div className="flex-1">
						<p className="text-sm font-medium">{alert.message}</p>
					</div>
					<button
						onClick={() => removeAlert(alert.id)}
						className="flex-shrink-0 hover:opacity-70 transition-opacity"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			))}
		</div>
	);
}
