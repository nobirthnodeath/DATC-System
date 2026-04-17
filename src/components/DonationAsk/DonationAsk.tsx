import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { ResolvedAsk } from "@/engine/types"
import { FullPageAsk } from "./FullPageAsk"
import { SidebarAsk } from "./SidebarAsk"
import { ModalAsk } from "./ModalAsk"

type Props = { ask: ResolvedAsk }

export function DonationAsk({ ask }: Props) {
  // Subtle fade when the underlying resolution changes so viewers notice the
  // swap. We key on a small signature of the visible state.
  const signature = `${ask.campaign.id}|${ask.surface.id}|${ask.amounts.values.join(",")}|${ask.messaging.cta}`
  const [visible, setVisible] = useState(true)
  const [current, setCurrent] = useState(ask)
  const [currentSig, setCurrentSig] = useState(signature)

  // When the resolved ask changes we briefly fade out, swap the content, then
  // fade back in. Intentional setState-in-effect: the animation needs a
  // layout tick between states.
  useEffect(() => {
    if (signature === currentSig) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false)
    const t = window.setTimeout(() => {
      setCurrent(ask)
      setCurrentSig(signature)
      setVisible(true)
    }, 120)
    return () => window.clearTimeout(t)
  }, [signature, currentSig, ask])

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
      )}
    >
      {renderForSurface(current)}
    </div>
  )
}

function renderForSurface(ask: ResolvedAsk) {
  switch (ask.surface.id) {
    case "full_page":
      return <FullPageAsk ask={ask} />
    case "sidebar":
      return <SidebarAsk ask={ask} />
    case "modal":
      return <ModalAsk ask={ask} />
  }
}
