import type { TimelineStep } from '../../types/models'

const CLS: Record<TimelineStep['state'], string> = { done: 'it dn', current: 'it cu', todo: 'it' }

export function Timeline({ steps, style }: { steps: TimelineStep[]; style?: React.CSSProperties }) {
  return (
    <div className="tl" style={style}>
      {steps.map((t) => (
        <div key={t.title} className={CLS[t.state]}>
          <span className="dot"></span>
          <div><div className="tx"><b>{t.title}</b></div><div className="tm">{t.note}</div></div>
        </div>
      ))}
    </div>
  )
}
