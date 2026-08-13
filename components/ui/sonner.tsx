"use client"

import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  AlertCircleIcon,
  Alert02Icon,
} from "hugeicons-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
            group toast
            flex items-start gap-3 p-3.5 pr-4
            bg-card
            border border-foreground/10
            rounded-md
            shadow-xl
            w-[360px] max-w-[calc(100vw-32px)]
          `,
          title: `
            text-sm font-medium text-foreground leading-snug tracking-tight
          `,
          description: `
            text-xs text-muted-foreground leading-relaxed mt-0.5
          `,
          actionButton: `
            text-xs font-medium px-2.5 py-1.5 rounded-md
            bg-primary text-primary-foreground
            hover:bg-foreground/90
            transition-colors duration-150
          `,
          cancelButton: `
            text-xs font-medium text-muted-foreground hover:text-foreground transition-colors
          `,
          closeButton: `
            absolute top-2.5 right-2.5 p-1 rounded-md
            text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]
            transition-colors duration-150
          `,
          icon: `
            mt-0.5 shrink-0
            [&>svg]:size-[18px]
          `,
        },
      }}
      icons={{
        success: (
          <div className="flex items-center justify-center size-7 rounded-md bg-foreground/[0.08] ring-1 ring-foreground/10">
            <CheckmarkCircle02Icon className="size-4 text-foreground" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center size-7 rounded-md bg-foreground/[0.08] ring-1 ring-foreground/10">
            <InformationCircleIcon className="size-4 text-foreground" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center size-7 rounded-md bg-amber-500/15 ring-1 ring-amber-500/20">
            <Alert02Icon className="size-4 text-amber-400" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center size-7 rounded-md bg-red-500/15 ring-1 ring-red-500/20">
            <AlertCircleIcon className="size-4 text-red-400" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center size-7 rounded-md bg-foreground/[0.08] ring-1 ring-foreground/10">
            <Loading03Icon className="size-4 text-muted-foreground animate-spin" />
          </div>
        ),
      }}
      offset={20}
      gap={10}
      duration={4000}
      {...props}
    />
  )
}

export { Toaster }
