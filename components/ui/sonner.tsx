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
            flex items-start gap-3.5 p-4 pr-5
            bg-[#0a0a0a]/95 backdrop-blur-xl
            border border-white/[0.08]
            rounded-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset]
            w-[380px] max-w-[calc(100vw-32px)]
            data-[type=success]:border-emerald-500/20
            data-[type=error]:border-red-500/20
            data-[type=warning]:border-amber-500/20
            data-[type=info]:border-blue-500/20
          `,
          title: `
            text-[15px] font-medium text-white/95 leading-snug tracking-[-0.01em]
          `,
          description: `
            text-[13px] text-white/50 leading-relaxed mt-1
          `,
          actionButton: `
            text-xs font-medium px-3 py-1.5 rounded-lg
            bg-white/10 text-white/80
            hover:bg-white/15 hover:text-white
            transition-all duration-200
          `,
          cancelButton: `
            text-xs font-medium text-white/40 hover:text-white/60 transition-colors
          `,
          closeButton: `
            absolute top-3 right-3 p-1 rounded-md
            text-white/30 hover:text-white/60 hover:bg-white/5
            transition-all duration-200
          `,
          icon: `
            mt-0.5 shrink-0
            [&>svg]:size-[18px]
            data-[type=success]:[&>svg]:text-emerald-400
            data-[type=error]:[&>svg]:text-red-400
            data-[type=warning]:[&>svg]:text-amber-400
            data-[type=info]:[&>svg]:text-blue-400
            [&>svg]:text-white/60
          `,
        },
      }}
      icons={{
        success: (
          <div className="flex items-center justify-center size-7 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/20">
            <CheckmarkCircle02Icon className="size-4 text-emerald-400" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center size-7 rounded-full bg-blue-500/15 ring-1 ring-blue-500/20">
            <InformationCircleIcon className="size-4 text-blue-400" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center size-7 rounded-full bg-amber-500/15 ring-1 ring-amber-500/20">
            <Alert02Icon className="size-4 text-amber-400" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center size-7 rounded-full bg-red-500/15 ring-1 ring-red-500/20">
            <AlertCircleIcon className="size-4 text-red-400" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center size-7 rounded-full bg-white/10 ring-1 ring-white/10">
            <Loading03Icon className="size-4 text-white/70 animate-spin" />
          </div>
        ),
      }}
      offset={20}
      gap={12}
      duration={4000}
      {...props}
    />
  )
}

export { Toaster }
