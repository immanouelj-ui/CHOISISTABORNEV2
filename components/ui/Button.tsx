import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = BaseProps & {
  href: string;
  children: React.ReactNode;
};

const styles = {
  primary: "bg-paper text-ink hover:bg-charge hover:text-paper",
  secondary: "border border-line text-paper hover:border-paper",
  ghost: "text-paper/80 hover:text-paper",
};

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 ease-premium",
        styles[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, href, children }: LinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 ease-premium",
        styles[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
