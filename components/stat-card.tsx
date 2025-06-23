"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
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
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
      case "down":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3" />;
      case "down":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card
        className={cn(
          "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm cursor-pointer",
          className
        )}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <motion.div
                  className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl"
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.4 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-blue-600 dark:text-blue-400">{icon}</div>
                </motion.div>
              )}
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {title}
                </p>
              </div>
            </div>
          </div>

          {/* Main Value */}
          <motion.div
            className="mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
          >
            <div className="text-3xl md:text-4xl font-bold text-foreground leading-none mb-2">
              {value}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>

          {/* Trend Indicator */}
          {trend && trendValue && (
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.5, duration: 0.4 }}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                  getTrendColor()
                )}
              >
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>

              {/* Decorative Element */}
              <motion.div
                className="w-8 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scaleX: 1.2 }}
              />
            </motion.div>
          )}

          {/* Background Pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Subtle Border Glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
