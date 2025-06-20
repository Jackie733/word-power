"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  BookOpen,
  RotateCcw,
  Library,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/learn/new", label: "Learn", icon: BookOpen },
    { href: "/learn/review", label: "Review", icon: RotateCcw },
    { href: "/words", label: "Words", icon: Library },
    { href: "/stats", label: "Stats", icon: BarChart3 },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="bg-background/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-2 group"
                onClick={closeMobileMenu}
              >
                <motion.span
                  className="text-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  💪
                </motion.span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Word Power
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                  >
                    <Button
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        isActive && "shadow-md"
                      )}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md"
                            layoutId="activeNav"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}

              {/* Desktop Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + navItems.length * 0.1,
                  duration: 0.3,
                }}
              >
                <ModeToggle />
              </motion.div>
            </div>

            {/* Mobile Menu Controls */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <ModeToggle />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Button
                          asChild
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start transition-all duration-300",
                            isActive && "shadow-md"
                          )}
                          onClick={closeMobileMenu}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center space-x-3 py-3"
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-base">{item.label}</span>
                          </Link>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
