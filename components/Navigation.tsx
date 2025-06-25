"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Library,
  Menu,
  X,
  Sparkles,
  Leaf,
  Wind,
  Sprout,
  TreePine,
  FlowerIcon as Flower,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Forest Home",
      icon: Home,
      description: "Your magical dashboard",
      color: "text-ghibli-blue",
      bgColor: "bg-blue-50/80 dark:bg-blue-900/20",
      hoverBg: "hover:bg-blue-100/80",
    },
    {
      href: "/learn/new",
      label: "Plant Seeds",
      icon: Sprout,
      description: "Discover new words",
      color: "text-ghibli-green",
      bgColor: "bg-green-50/80 dark:bg-green-900/20",
      hoverBg: "hover:bg-green-100/80",
    },
    {
      href: "/learn/review",
      label: "Tend Garden",
      icon: Flower,
      description: "Review learned words",
      color: "text-ghibli-red",
      bgColor: "bg-red-50/80 dark:bg-red-900/20",
      hoverBg: "hover:bg-red-100/80",
    },
    {
      href: "/words",
      label: "Magic Library",
      icon: Library,
      description: "Browse your collection",
      color: "text-purple-600",
      bgColor: "bg-purple-50/80 dark:bg-purple-900/20",
      hoverBg: "hover:bg-purple-100/80",
    },
    {
      href: "/stats",
      label: "Growth Chart",
      icon: TreePine,
      description: "Track your progress",
      color: "text-amber-600",
      bgColor: "bg-amber-50/80 dark:bg-amber-900/20",
      hoverBg: "hover:bg-amber-100/80",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b border-border/40 watercolor-bg backdrop-blur-xl shadow-natural motion-safe"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-2 left-20 text-ghibli-green/30"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="absolute top-4 right-32 text-ghibli-blue/30"
          animate={{
            y: [0, 8, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Wind className="w-3 h-3" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 motion-safe hover-fix"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative p-2 ghibli-blue rounded-2xl shadow-natural motion-safe motion-scale"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
                <motion.div
                  className="absolute -inset-1 ghibli-blue rounded-2xl opacity-20 blur-sm"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-handwritten-bold text-xl text-ghibli-blue">
                  Word Power
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Magical Learning Journey
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? cn("text-foreground shadow-natural", item.bgColor)
                        : cn(
                            "text-muted-foreground hover:text-foreground",
                            item.hoverBg
                          )
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-all duration-300",
                        isActive
                          ? item.color
                          : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs opacity-60 group-hover:opacity-80 transition-opacity">
                        {item.description}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-ghibli-blue/10 via-ghibli-green/10 to-ghibli-red/10"
                        layoutId="activeTab"
                        transition={{ duration: 0.4 }}
                      />
                    )}

                    {/* Hover magical effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(136, 170, 204, 0.1) 0%, transparent 70%)",
                      }}
                      initial={false}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl hover:bg-muted/50"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="py-4 space-y-2 border-t border-border/40">
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
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                          isActive
                            ? cn("text-foreground shadow-natural", item.bgColor)
                            : cn(
                                "text-muted-foreground hover:text-foreground",
                                item.hoverBg
                              )
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? item.color : "text-muted-foreground"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span className="text-xs opacity-60">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
