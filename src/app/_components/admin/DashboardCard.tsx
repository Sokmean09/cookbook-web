"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardCard({
	title,
	total,
	path,
	label,
}: {
	title: string;
	total: number;
	path?: string;
	label?: string;
}) {
	const content = (
		<Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-transform duration-100 hover:scale-101">
			<CardHeader>
				<CardTitle className="text-2xl text-center wrap-anywhere">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					<span className="text-muted-foreground">
						{label ?? `Total ${title} found:`}
					</span>{" "}
					{total}
				</div>
			</CardContent>
		</Card>
	);

	// Wrap in Link if path is provided
	return path ? <Link href={path}>{content}</Link> : content;
}
