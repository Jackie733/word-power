"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
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
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                {title}
              </p>
              <motion.p
                className="text-xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.3 }}
              >
                {value}
              </motion.p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {trend && trendValue && (
                <motion.div
                  className={cn("flex items-center text-xs", getTrendColor())}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.4 }}
                >
                  <span>{trendValue}</span>
                </motion.div>
              )}
            </div>
            {icon && (
              <motion.div
                className="text-2xl opacity-60"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: delay + 0.1, duration: 0.4 }}
              >
                {icon}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
