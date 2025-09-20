"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";


const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const isMobileQuery = useMediaQuery({ query: '(max-width: 650px)' });
  const [menu, setMenu] = useState(false);

  const isMobile = isClient && isMobileQuery;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {isMobile && (
        <div className="absolute top-[4rem] left-4">
          <Menu
            onClick={() => setMenu(!menu)}
            className="w-6 h-6 text-black"
            strokeWidth={1}
          />
        </div>
      )}
      <img src="/tmp_logo.png" alt="Logo" className="w-[12rem] h-auto" />
      {!isMobile && <div className="flex flex-row justify-between w-full md:px-6 pb-2 text-black xs:text-sm md:text-lg font-extralight bg-white">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <span
                className={`
                relative
                ${isActive ? "opacity-50" : "opacity-100"}
                transition-opacity duration-300 ease-in-out
              `}
              >
                {!isActive && (
                  <span
                    className="
                    absolute inset-0 bg-gradient-to-r from-white/0 to-white/70
                    pointer-events-none
                    transition-all duration-500 ease-in-out
                    group-hover:w-full w-0
                  "
                  ></span>
                )}
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>}
    </div>
  );
}
