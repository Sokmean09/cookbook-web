import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<div className="relative h-48 w-full">
				<Skeleton className="h-full w-full" />
			</div>
			<CardContent className="p-1 text-center">
				<Skeleton className="h-6 w-3/4 mx-auto" />
			</CardContent>
		</Card>
	);
}
