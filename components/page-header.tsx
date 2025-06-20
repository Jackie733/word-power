"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref = "/",
  backLabel = "Back to Dashboard",
  action,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      className={cn("mb-4 md:mb-6", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.div
        className="mb-3 md:mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{backLabel}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
      </motion.div>

      {/* Title and Action */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <motion.div
          className="min-w-0 flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {action && (
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
