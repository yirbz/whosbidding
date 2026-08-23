import * as React from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "ember" | "brass";
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-[20px] px-3 py-1 text-[13px] font-polysans font-normal tracking-[-0.02em]",
          variant === "default" && "bg-[#efefef] text-[#202020]",
          variant === "ember" && "bg-[#ff682c]/10 text-[#ff682c]",
          variant === "brass" && "bg-[#816729]/10 text-[#816729]",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";
