'use client';
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function MainNavi() {
    const segment = useSelectedLayoutSegment();
    const navClass = "px-5 py-3 rounded-full text-white"
    const activeNavClass = `${navClass} bg-indigo-400`;
    return (
        <nav className=" bg-indigo-950 justify-items-center lg:justify-items-end lg:px-77">
            <ul className="flex  py-6 gap-x-4 font-bold">
                <li>
                    <Link href="/" className={segment == null ? activeNavClass : navClass}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/recipes" className={segment == 'recipes' ? activeNavClass : navClass}>
                        Recipes
                    </Link>
                </li>
                <li>
                    <Link href="/about" className={segment == 'about' ? activeNavClass : navClass}>
                        About
                    </Link>
                </li>
                <li>
                    <Link href="/admin" className={segment == 'admin' ? activeNavClass : navClass}>
                        Admin
                    </Link>
                </li>
            </ul>
        </nav>
    );
}