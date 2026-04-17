import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  linksOut?: boolean
  size?: "default" | "lg" | "xl"
  className?: string
}

export function CTA({ label, linksOut = false, size = "lg", className }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(id)
  }, [toast])

  return (
    <div className="relative">
      <Button
        size={size}
        className={cn("w-full", className)}
        onClick={() =>
          setToast(
            linksOut
              ? "In production this would open the full donation page."
              : "This is a demo — no payment will be processed.",
          )
        }
      >
        {label}
      </Button>
      {toast && (
        <div
          role="status"
          className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
