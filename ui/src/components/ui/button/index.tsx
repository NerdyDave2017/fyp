import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const sizeClass = sizeClasses[size] || sizeClasses["md"];
  return (
    <button className={`${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
