import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex transform-gpu items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none",
  {
    variants: {
      variant: {
        default:
          "btn-premium shadow-[0_12px_28px_rgba(37,99,235,0.18)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-[0_14px_28px_rgba(220,38,38,0.22)]",
        outline:
          "border border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background hover:text-foreground hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.45)]",
        secondary:
          "border border-border/80 bg-background text-secondary-foreground hover:-translate-y-0.5 hover:border-primary/25 hover:bg-background hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_16px_30px_rgba(0,0,0,0.35)]",
        ghost: "text-foreground/80 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_10px_22px_rgba(15,23,42,0.05)] dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.3)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
