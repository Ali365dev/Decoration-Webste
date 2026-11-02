import { cn } from "./cn";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "block h-[var(--input-height)] w-full rounded-pill border border-line-soft bg-paper px-5 py-2.5 font-sans text-sm font-normal text-body shadow-none outline-none placeholder:text-placeholder",
        className,
      )}
      {...props}
    />
  );
}
