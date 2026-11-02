import { cn } from "./cn";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  link: "border-0 bg-transparent p-0 text-base font-normal normal-case leading-7 text-ink",
  secondary:
    "border border-line bg-paper px-[55px] py-[13.6px] text-xs font-medium uppercase leading-[21px] text-ink hover:border-ink hover:bg-ink hover:text-white",
  primary:
    "border border-ink bg-ink px-[55px] py-[13.6px] text-xs font-medium uppercase leading-[21px] text-white",
  icon: "size-10 rounded-full border-0 bg-ink p-0 text-base font-normal normal-case leading-7 text-body",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-block cursor-pointer rounded-pill font-sans shadow-none transition-all duration-[0.4s] ease-[ease]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
