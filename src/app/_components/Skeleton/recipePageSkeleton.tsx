"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RecipePageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-12 px-12 bg-gray-200">
      {/* Back Button */}
      <div className="mb-6">
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Hero Section */}
      <div className="mb-10">
        <Skeleton className="h-[350px] w-full rounded-2xl" />

        <Skeleton className="mt-6 h-10 w-1/2" /> {/* title */}
        <Skeleton className="mt-4 h-6 w-28 rounded-full" /> {/* badge */}
        <Skeleton className="mt-4 h-20 w-full" /> {/* description */}
      </div>

      <Skeleton className="my-8 h-[2px] w-full" />

      {/* Ingredients */}
      <div className="mb-10">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-2 pl-6">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>

      <Skeleton className="my-8 h-[2px] w-full" />

      {/* Instructions */}
      <div className="mb-10">
        <Skeleton className="h-8 w-44 mb-4" /> 
        <div className="space-y-4 pl-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <Skeleton className="my-8 h-[2px] w-full" />

      {/* Gallery */}
      <div className="mb-10">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>

      <Skeleton className="my-8 h-[2px] w-full" />

      {/* Extra Recipe Info */}
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
