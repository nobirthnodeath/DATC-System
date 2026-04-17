import { useMemo, useState } from "react"
import { ControlPanel } from "@/components/ControlPanel/ControlPanel"
import { SystemLog } from "@/components/ControlPanel/SystemLog"
import { DonationAsk } from "@/components/DonationAsk/DonationAsk"
import { campaigns } from "@/data/campaigns"
import { contexts } from "@/data/contexts"
import { entrySources } from "@/data/entrySources"
import { surfaces } from "@/data/surfaces"
import { users } from "@/data/users"
import { resolve } from "@/engine"
import type { SurfaceId } from "@/engine/types"

// Pin "now" inside all campaigns' active windows so the demo is deterministic
// regardless of the actual calendar date.
const DEMO_NOW = new Date("2026-04-17T12:00:00Z")

function App() {
  const [userId, setUserId] = useState(users[0].id)
  const [surfaceId, setSurfaceId] = useState<SurfaceId>("full_page")
  const [contextId, setContextId] = useState(contexts[0].id)
  const [entrySourceId, setEntrySourceId] = useState(entrySources[0].id)

  const user = users.find((u) => u.id === userId) ?? users[0]
  const surface = surfaces.find((s) => s.id === surfaceId) ?? surfaces[0]
  const contentContext = contexts.find((c) => c.id === contextId) ?? contexts[0]
  const entrySource =
    entrySources.find((e) => e.id === entrySourceId) ?? entrySources[0]

  const { resolvedAsk, decisionLog } = useMemo(
    () =>
      resolve({
        user,
        surface,
        contentContext,
        entrySource,
        campaigns,
        now: DEMO_NOW,
      }),
    [user, surface, contentContext, entrySource],
  )

  return (
    <div className="min-h-svh bg-muted/30 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-baseline gap-3 px-6 py-4">
          <h1 className="text-lg font-semibold">Donation ATC — Interactive Demo</h1>
          <p className="text-xs text-muted-foreground">
            Proof-of-concept · no backend · decisions run client-side
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border bg-background p-4 shadow-sm">
            <header className="mb-4 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">Control panel</h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                god mode
              </span>
            </header>
            <ControlPanel
              users={users}
              surfaces={surfaces}
              contexts={contexts}
              entrySources={entrySources}
              selectedUserId={userId}
              selectedSurfaceId={surfaceId}
              selectedContextId={contextId}
              selectedEntrySourceId={entrySourceId}
              onUserChange={setUserId}
              onSurfaceChange={setSurfaceId}
              onContextChange={setContextId}
              onEntrySourceChange={setEntrySourceId}
            />
          </section>
          <SystemLog log={decisionLog} />
        </aside>

        <section className="min-w-0 rounded-lg border bg-background p-6 shadow-sm">
          <DonationAsk ask={resolvedAsk} />
        </section>
      </main>
    </div>
  )
}

export default App
