import * as React from "react";
import { cn } from "@/lib/utils";

export interface NavPillProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavPill = React.forwardRef<HTMLDivElement, NavPillProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-5 bg-[#efefef] rounded-[200px] px-[18px] py-[8px] font-polysans text-[16px] font-normal tracking-[-0.02em] text-[#202020] shadow-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavPill.displayName = "NavPill";
