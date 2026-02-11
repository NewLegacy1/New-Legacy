"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { CALENDLY_CONSULTATION_URL } from "@/lib/links";

export default function Hero() {
  // Original: #home hero section with headline, subhead, CTAs, and feature card.
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative">
      <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-phoenix-gold/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 space-y-8">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              THE LEGACY YOU BUILD <br />
              SHOULDN&apos;T <span className="fire-text">BURN YOU OUT.</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-ash-gray font-light max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Custom websites, CRMs + automations, and growth operations — built
              to keep your business scalable and easy to run.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href={CALENDLY_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                BOOK A CONSULTATION
              </a>
              <a
                href="#services"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Play size={18} />
                SEE OUR SERVICES
              </a>
            </motion.div>
          </div>

          <motion.div
            className="w-full md:w-1/3 mt-16 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-phoenix-gold to-sunset-orange rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-charcoal/60 backdrop-blur-sm border border-ash-gray/20 rounded-xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-phoenix-gold flex items-center justify-center text-charcoal font-bold">
                      1
                    </div>
                    <div className="text-pure-white">Custom Websites</div>
                    <div className="ml-auto w-4 h-4 rounded-full bg-sunset-orange" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-phoenix-gold flex items-center justify-center text-charcoal font-bold">
                      2
                    </div>
                    <div className="text-pure-white">Custom CRMs & Automations</div>
                    <div className="ml-auto w-4 h-4 rounded-full bg-sunset-orange" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-phoenix-gold flex items-center justify-center text-charcoal font-bold">
                      3
                    </div>
                    <div className="text-pure-white">Growth Operations for Creators</div>
                    <div className="ml-auto w-4 h-4 rounded-full bg-sunset-orange" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-phoenix-gold flex items-center justify-center text-charcoal font-bold">
                      4
                    </div>
                    <div className="text-pure-white">Custom App Solutions</div>
                    <div className="ml-auto w-4 h-4 rounded-full bg-sunset-orange" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
