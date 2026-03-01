"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/categories";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-brand">
          GlobalNews
        </Link>
      </div>

      <nav className="border-t">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto py-3">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.value}`;

            return (
              <Link
                key={cat.value}
                href={`/category/${cat.value}`}
                className={`whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? "text-brand border-b-2 border-brand pb-1"
                    : "text-gray-600 hover:text-brand"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
