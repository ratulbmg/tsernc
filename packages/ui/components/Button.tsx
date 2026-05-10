import React from "react";
import { cn } from "../utils/cn";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  variant: "primary" | "denger" | "secondary";
};

const Button: React.FC<ButtonProps> = (props) => {
  const baseClasses = "cursor-pointer";

  const variantClasses = {
    primary:
      "w-full h-10 text-sm text-white bg-background-dark dark:bg-background text-text-0 dark:text-text-dark-900 rounded-sm",
    secondary:
      "bg-black text-white dark:text-black dark:bg-white hover:bg-gray-800 rounded-lg px-5 py-2.5 text-center mb-2",
    denger:
      "text-white bg-red-500 hover:bg-red-600 hover:text-white rounded-lg px-5 py-2.5 text-center mb-2",
  };

  return (
    <>
      <button
        title={props.title}
        onClick={props.onClick}
        type="submit"
        disabled={props.disabled}
        className={cn(
          `${baseClasses} ${variantClasses[props.variant]} ${props.className} ${props.disabled && "opacity-50 cursor-not-allowed "}`,
        )}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
