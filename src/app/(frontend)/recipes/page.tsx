"use client"
import RecipesCardList from "@/app/_components/recipes/recipesCard";
import { SearchModal } from "@/app/_components/recipes/search-modal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useState } from "react";

export default function Recipes() {
	const [openSearch, setOpenSearch] = useState(false);
	return (
		<div className="mx-10 my-10">
      <div className="flex">  
        <Button
          className="bg-background hover:bg-gray-100 w-2xs justify-start hover:cursor-pointer"
          onClick={() => setOpenSearch(true)}
        >
          <Search className="text-black mr-2" />
          <span className="text-gray-500 font-normal">Search</span>
        </Button>
      </div>

      <div>
        <h1 className="font-medium text-4xl my-6">All Recipes</h1>
        <RecipesCardList />
      </div>

      {/* Modal */}
      <SearchModal open={openSearch} setOpen={setOpenSearch} />
    </div>
	);
}
