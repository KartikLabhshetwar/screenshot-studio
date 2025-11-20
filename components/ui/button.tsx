"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm hover:shadow-md",
        destructive:
          "bg-muted text-destructive hover:bg-destructive/10 active:bg-destructive/5 border border-destructive/20 hover:border-destructive/40 rounded-lg shadow-sm hover:shadow-md",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-sm",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/70 shadow-sm hover:shadow-md border border-border rounded-lg",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent/50 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        integration:
          "bg-primary text-primary-foreground uppercase font-bold rounded-full tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.25)] hover:bg-primary/90 active:bg-primary/80 active:shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.2)] active:translate-y-[1px] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  showArrow,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    showArrow?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const shouldShowArrow = showArrow ?? (variant === "integration")

  const content = (
    <>
      {children}
      {shouldShowArrow && !asChild && <ArrowRight className="size-5" />}
    </>
  )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
