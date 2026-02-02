"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "SERVICES", href: "#services" },
  { name: "PROCESS", href: "#automation" },
  { name: "WORK", href: "#clients" },
  { name: "ABOUT", href: "#why-us" },
  { name: "INTAKE", href: "/intake" },
  { name: "CONTACT", href: "#case-studies" },
  {
    name: "CONTACT",
    href: "https://api.leadconnectorhq.com/widget/booking/LVNlkCPBjoVt8iwDpZUR",
    isButton: true,
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Original: fixed top navigation with desktop links and mobile overlay menu.
  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="container mx-auto px-4 py-4 flex items-center">
          <a href="#home" className="flex items-center">
            <img
              src="/new-legacy-logo.png"
              alt="New Legacy AI"
              className="w-16 h-16"
            />
          </a>

          <div className="hidden md:flex items-center justify-center flex-grow gap-8">
            {navItems.map((item) => (
              <a
                key={`${item.name}-${item.href}`}
                href={item.href}
                target={item.isButton ? "_blank" : undefined}
                rel={item.isButton ? "noopener noreferrer" : undefined}
                className={`font-syne text-sm tracking-wider transition-colors duration-300 ${
                  item.isButton
                    ? "bg-gradient-phoenix text-charcoal px-6 py-2 rounded-full hover:opacity-90"
                    : "hover:text-phoenix-gold"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-pure-white ml-auto focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "visible" : "hidden"}`}>
        <button
          type="button"
          aria-label="Close menu"
          className="absolute right-6 top-6 rounded-full border border-ash-gray/20 bg-charcoal/70 p-3 text-pure-white hover:border-phoenix-gold/40"
          onClick={() => setMenuOpen(false)}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center space-y-8">
          {navItems.map((item) => (
            <a
              key={`${item.name}-${item.href}`}
              href={item.href}
              target={item.isButton ? "_blank" : undefined}
              rel={item.isButton ? "noopener noreferrer" : undefined}
              className={`font-syne text-xl tracking-wider transition-colors duration-300 ${
                item.isButton
                  ? "bg-gradient-phoenix text-charcoal px-8 py-3 rounded-full hover:opacity-90"
                  : "hover:text-phoenix-gold"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
