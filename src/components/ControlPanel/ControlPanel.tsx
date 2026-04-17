import { Select } from "@/components/ui/select"
import { Segmented } from "@/components/ui/segmented"
import type {
  ContentContext,
  EntrySource,
  Surface,
  SurfaceId,
  User,
} from "@/engine/types"

type Props = {
  users: User[]
  surfaces: Surface[]
  contexts: ContentContext[]
  entrySources: EntrySource[]
  selectedUserId: string
  selectedSurfaceId: SurfaceId
  selectedContextId: string
  selectedEntrySourceId: string
  onUserChange: (id: string) => void
  onSurfaceChange: (id: SurfaceId) => void
  onContextChange: (id: string) => void
  onEntrySourceChange: (id: string) => void
}

export function ControlPanel({
  users,
  surfaces,
  contexts,
  entrySources,
  selectedUserId,
  selectedSurfaceId,
  selectedContextId,
  selectedEntrySourceId,
  onUserChange,
  onSurfaceChange,
  onContextChange,
  onEntrySourceChange,
}: Props) {
  const selectedUser = users.find((u) => u.id === selectedUserId)

  return (
    <div className="space-y-5">
      <Field label="User" htmlFor="user-select">
        <Select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => onUserChange(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
        {selectedUser && <UserSummary user={selectedUser} />}
      </Field>

      <Field label="Surface">
        <Segmented<SurfaceId>
          aria-label="Surface"
          value={selectedSurfaceId}
          onChange={onSurfaceChange}
          options={surfaces.map((s) => ({
            value: s.id,
            label: s.label.replace(" / Overlay", "").replace("Full Checkout Page", "Full Page").replace("Article Sidebar", "Sidebar"),
          }))}
        />
      </Field>

      <Field label="Content context" htmlFor="context-select">
        <Select
          id="context-select"
          value={selectedContextId}
          onChange={(e) => onContextChange(e.target.value)}
        >
          {contexts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Entry source" htmlFor="entry-select">
        <Select
          id="entry-select"
          value={selectedEntrySourceId}
          onChange={(e) => onEntrySourceChange(e.target.value)}
        >
          {entrySources.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function UserSummary({ user }: { user: User }) {
  const bits: string[] = []
  bits.push(user.is_known ? "Known" : "Unknown")
  if (user.avg_donation != null) bits.push(`avg $${user.avg_donation}`)
  if (user.interests.length > 0) bits.push(`interests: ${user.interests.join(", ")}`)
  if (user.cohorts.length > 0) bits.push(`cohort: ${user.cohorts.join(", ")}`)
  bits.push(user.lifecycle)
  return (
    <p className="mt-1 text-xs text-muted-foreground">
      {bits.join(" · ")}
    </p>
  )
}
