import * as React from "react";
import { cn } from "@/lib/utils";

export interface AsymmetricCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AsymmetricCard = React.forwardRef<HTMLDivElement, AsymmetricCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#efefef] rounded-tl-[6px] rounded-tr-none rounded-br-none rounded-bl-none pt-[70px] pl-[60px] pr-[60px] pb-[70px] shadow-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AsymmetricCard.displayName = "AsymmetricCard";
