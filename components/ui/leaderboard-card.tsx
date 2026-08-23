import * as React from "react";
import { cn } from "@/lib/utils";

export interface LeaderboardCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LeaderboardCard = React.forwardRef<HTMLDivElement, LeaderboardCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#efefef] rounded-[8px] p-[40px] shadow-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LeaderboardCard.displayName = "LeaderboardCard";
