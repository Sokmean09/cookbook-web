import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/2]">
				<Skeleton className="h-full w-full" />
			</div>
			<CardContent className="p-2 text-center">
				<Skeleton className="h-6 w-3/4 mx-auto" />
			</CardContent>
		</Card>
	);
}
