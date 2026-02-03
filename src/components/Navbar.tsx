"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLeadCapture } from "@/components/LeadCaptureProvider";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openLeadForm } = useLeadCapture();

  const navItems: Array<{
    name: string;
    href?: string;
    isButton?: boolean;
    onClick?: () => void;
  }> = [
    { name: "SERVICES", href: "#services" },
    { name: "WORK", href: "#clients" },
    { name: "ABOUT", href: "#why-us" },
    { name: "CONTACT", isButton: true, onClick: openLeadForm },
  ];

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
              item.onClick ? (
                <button
                  key={item.name}
                  type="button"
                  onClick={item.onClick}
                  className={`font-syne text-sm tracking-wider transition-colors duration-300 ${
                    item.isButton
                      ? "bg-gradient-phoenix text-charcoal px-6 py-2 rounded-full hover:opacity-90"
                      : "hover:text-phoenix-gold"
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <a
                  key={`${item.name}-${item.href}`}
                  href={item.href}
                  className={`font-syne text-sm tracking-wider transition-colors duration-300 ${
                    item.isButton
                      ? "bg-gradient-phoenix text-charcoal px-6 py-2 rounded-full hover:opacity-90"
                      : "hover:text-phoenix-gold"
                  }`}
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          <a
            href="https://crm-kjw72gfn0-new-legacys-projects.vercel.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block font-syne text-sm tracking-wider transition-colors duration-300 hover:text-phoenix-gold ml-4"
          >
            LOGIN
          </a>

          <button
            className="md:hidden text-pure-white ml-auto focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="rounded-full border border-ash-gray/20 bg-charcoal/70 p-3 text-pure-white hover:border-phoenix-gold/40"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 2147483647,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <X size={24} />
        </button>
      ) : null}

      <div className={`mobile-menu ${menuOpen ? "visible" : "hidden"}`}>
        <div className="flex flex-col items-center space-y-8">
          {navItems.map((item) => (
            item.onClick ? (
              <button
                key={item.name}
                type="button"
                className={`font-syne text-xl tracking-wider transition-colors duration-300 ${
                  item.isButton
                    ? "bg-gradient-phoenix text-charcoal px-8 py-3 rounded-full hover:opacity-90"
                    : "hover:text-phoenix-gold"
                }`}
                onClick={() => {
                  setMenuOpen(false);
                  item.onClick?.();
                }}
              >
                {item.name}
              </button>
            ) : (
              <a
                key={`${item.name}-${item.href}`}
                href={item.href}
                className={`font-syne text-xl tracking-wider transition-colors duration-300 ${
                  item.isButton
                    ? "bg-gradient-phoenix text-charcoal px-8 py-3 rounded-full hover:opacity-90"
                    : "hover:text-phoenix-gold"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            )
          ))}
          <a
            href="https://crm-kjw72gfn0-new-legacys-projects.vercel.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="font-syne text-xl tracking-wider transition-colors duration-300 hover:text-phoenix-gold"
            onClick={() => setMenuOpen(false)}
          >
            LOGIN
          </a>
        </div>
      </div>
    </>
  );
}
