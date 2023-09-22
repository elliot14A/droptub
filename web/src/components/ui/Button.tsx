import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

export const buttonVariant = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "bg-transparent hover:bg-slate-900 text-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        small: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariant> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  isLoading,
  size,
  variant,
  type,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariant({ variant, size, className }))}
      disabled={isLoading}
      {...props}
      type={type}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
