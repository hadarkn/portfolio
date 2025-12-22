"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantClass =
      variant === "outline" ? "border border-current bg-transparent" : "bg-transparent"

    return (
      <Comp
        ref={ref}
        className={clsx("inline-flex items-center justify-center whitespace-nowrap", variantClass, className)}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"
