'use client';
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useAuth } from "../_components/AuthProvider";
import { AccountMenu } from "../_components/Account-menu";

export default function MainNavi() {
  const segment = useSelectedLayoutSegment();
  const navClass = "px-5 py-3 rounded-full text-white"
  const activeNavClass = `${navClass} bg-indigo-400`;

  const { currentUser } = useAuth();

  return (
    <nav className="bg-indigo-950 px-6 lg:px-42">
      <div className="flex items-center justify-between">
        <ul className="flex py-6 gap-x-6 font-bold">
          <li>
            <Link
              href="/"
              className={segment == null ? activeNavClass : navClass}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/recipes"
              className={segment == "recipes" ? activeNavClass : navClass}
            >
              Recipes
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={segment == "about" ? activeNavClass : navClass}
            >
              About
            </Link>
          </li>
        </ul>
        <AccountMenu />
      </div>
    </nav>
  )
}