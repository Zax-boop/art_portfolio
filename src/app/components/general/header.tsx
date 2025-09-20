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

  const [closing, setClosing] = useState(false);

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setMenu(false);
      setClosing(false);
    }, 500);
  };

  const isMobile = isClient && isMobileQuery;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="md:hidden absolute top-[4rem] left-4">
        <button
          onClick={() => (menu ? closeMenu() : setMenu(true))}
          className={`relative w-8 h-8 text-black transition-transform duration-500 ${menu ? "rotate-180" : "rotate-0"}`}
        >
          <Menu
            className={`absolute inset-0 w-8 h-8 transition-opacity duration-300 ${menu ? "opacity-0" : "opacity-100"}`}
            strokeWidth={1}
          />
          <span
            className={`absolute inset-0 flex items-center justify-center text-3xl transition-opacity duration-300 ${menu ? "opacity-100" : "opacity-0"}`}
          >
            ✕
          </span>
        </button>
      </div>
      {isMobile && (menu || closing) && (
        <div
          className={`absolute bottom-0 h-4/5 left-0 w-full bg-white z-10 flex flex-col items-center justify-center text-black text-2xl
            ${closing ? "animate-fadeOutDown" : "animate-fadeInUp"}
          `}
        >
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full text-center py-4 ${closing ? "animate-fadeOutDown" : "animate-fadeInUp"} `}
                onClick={() => setMenu(false)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span
                  className={`relative transition-opacity duration-300 ${isActive ? "opacity-50" : "opacity-100"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
      <Link href="/" className="">
        <img src="/tmp_logo.png" alt="Logo" className="w-[12rem] h-auto" />
      </Link>
      {
        !isMobile && <div className="hidden md:flex flex-row justify-between w-full md:px-6 pb-2 text-black xs:text-sm md:text-lg font-extralight bg-white">
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
                      className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/70 pointer-events-none transition-all duration-500 ease-in-out group-hover:w-full w-0"
                    ></span>
                  )}
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      }
    </div >
  );
}
