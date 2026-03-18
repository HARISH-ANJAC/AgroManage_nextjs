"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) {
  const changeColor = changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
          {change && <p className={`text-xs mt-1 font-medium ${changeColor}`}>{change}</p>}
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconColor || "bg-primary/10"}`}>
          <Icon className={`h-5 w-5 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
    </div>
  );
}
