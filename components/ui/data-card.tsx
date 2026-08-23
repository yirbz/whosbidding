import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#ffffff] rounded-[20px] p-[40px] shadow-none border border-[#e8e8e8]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DataCard.displayName = "DataCard";
