"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Wind, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  delay?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  delay = 0,
  trend,
  trendValue,
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-ghibli-green bg-green-50/80 dark:bg-green-900/20 border border-green-200/50";
      case "down":
        return "text-ghibli-red bg-red-50/80 dark:bg-red-900/20 border border-red-200/50";
      default:
        return "text-ghibli-blue bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <Leaf className="w-3 h-3" />;
      case "down":
        return <Wind className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };

  const getFloatingDecoration = () => {
    switch (trend) {
      case "up":
        return "🌱";
      case "down":
        return "🍃";
      default:
        return "✨";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative motion-safe hover-fix"
    >
      {/* Floating magical elements */}
      <motion.div
        className="absolute -top-2 -right-2 text-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none z-10"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {getFloatingDecoration()}
      </motion.div>

      <Card
        className={cn(
          "overflow-hidden shadow-natural hover:shadow-natural-lg transition-all duration-500 watercolor-bg page-turn cursor-pointer h-full",
          className
        )}
      >
        <CardContent className="p-6 h-full flex flex-col justify-between min-h-[200px] relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <motion.div
              className="absolute top-4 right-4 text-4xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {getFloatingDecoration()}
            </motion.div>
          </div>

          <div className="flex-1 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {icon && (
                  <motion.div
                    className="relative p-3 watercolor-bg rounded-2xl shadow-natural motion-safe motion-scale"
                    initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: delay + 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                  >
                    <div className="text-ghibli-blue">{icon}</div>
                    <motion.div
                      className="absolute -inset-1 bg-ghibli-blue/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
                <div>
                  <p className="font-handwritten text-ghibli-green font-medium tracking-wide">
                    {title}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Value */}
            <motion.div
              className="mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.4, duration: 0.6 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-handwritten-bold text-ghibli-blue leading-none mb-3 motion-safe motion-scale"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.div>
              <div className="min-h-[1.5rem]">
                {description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Trend Indicator */}
          {trend && trendValue && (
            <motion.div
              className="flex items-center justify-between mt-auto relative z-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.6, duration: 0.5 }}
            >
              <motion.div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-300",
                  getTrendColor()
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {getTrendIcon()}
                </motion.div>
                <span className="font-medium">{trendValue}</span>
              </motion.div>

              {/* Magical floating sparkles */}
              <motion.div
                className="flex gap-1"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        trend === "up"
                          ? "#556B2F"
                          : trend === "down"
                            ? "#D14B31"
                            : "#88AACC",
                    }}
                    animate={{
                      scale: [0.5, 1, 0.5],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Breathing glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(136, 170, 204, 0.1) 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
