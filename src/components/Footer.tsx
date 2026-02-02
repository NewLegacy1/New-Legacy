"use client";

import { Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react";

export default function Footer() {
  // Original: footer with brand summary, nav, contact, and legal columns.
  return (
    <footer className="bg-charcoal/95 border-t border-ash-gray/20 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/new-legacy-logo.png"
                alt="New Legacy AI"
                className="w-8 h-8"
              />
              <span className="font-syne font-bold text-xl">NEW LEGACY AI</span>
            </div>
            <p className="text-ash-gray mb-6">
              Custom websites, backend systems, CRM workflows, and analytics —
              built to scale.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-ash-gray hover:text-phoenix-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-ash-gray hover:text-phoenix-gold transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-ash-gray hover:text-phoenix-gold transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-syne text-lg mb-6">NAVIGATION</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#clients"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Clients
                </a>
              </li>
              <li>
                <a
                  href="#why-us"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Why Us
                </a>
              </li>
              <li>
                <a
                  href="#start-now"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Start Now
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-syne text-lg mb-6">CONTACT</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-ash-gray">
                <Mail size={16} />
                <a
                  href="mailto:contact@newlegacyai.ca"
                  className="hover:text-phoenix-gold transition-colors"
                >
                  contact@newlegacyai.ca
                </a>
              </li>
              <li className="flex items-center gap-2 text-ash-gray">
                <Phone size={16} />
                <a
                  href="tel:+15555555555"
                  className="hover:text-phoenix-gold transition-colors"
                >
                  (555) 555-5555
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-syne text-lg mb-6">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-ash-gray hover:text-phoenix-gold transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ash-gray/20 mt-12 pt-8 text-center text-ash-gray">
          <p>© {new Date().getFullYear()} New Legacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
