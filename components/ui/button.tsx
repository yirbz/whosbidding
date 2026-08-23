import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "ember";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-polysans font-normal tracking-[-0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          "rounded-full",
          variant === "primary" &&
            "bg-[#202020] text-[#ffffff] border border-[#202020] hover:bg-[#ffffff] hover:text-[#202020]",
          variant === "ghost" &&
            "bg-transparent text-[#202020] border border-[#202020] hover:bg-[#202020] hover:text-[#ffffff]",
          variant === "ember" &&
            "bg-[#ff682c] text-[#ffffff] border border-[#ff682c] hover:bg-[#ffffff] hover:text-[#ff682c]",
          size === "default" && "h-[52px] px-[32px] py-3.5 text-[16px] leading-[1.0]",
          size === "sm" && "h-9 px-4 py-1.5 text-[14px]",
          size === "lg" && "h-[58px] px-10 py-4 text-[18px]",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
