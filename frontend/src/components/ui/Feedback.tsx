import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ConfirmOptions {
  title: string
  body: string
  ok: string
  danger?: boolean
  onConfirm?: () => void
}

interface Feedback {
  toast: (text: string) => void
  /** Actions that need the backend show this until the REST API is wired in. */
  notConnected: () => void
  confirm: (opts: ConfirmOptions) => void
}

const FeedbackContext = createContext<Feedback | null>(null)

export function useFeedback(): Feedback {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used inside FeedbackProvider')
  return ctx
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState<string | null>(null)
  const [modal, setModal] = useState<ConfirmOptions | null>(null)

  const toast = useCallback((t: string) => setText(t), [])
  const notConnected = useCallback(() => setText('Not connected to the backend yet'), [])
  const confirm = useCallback((o: ConfirmOptions) => setModal(o), [])

  return (
    <FeedbackContext.Provider value={{ toast, notConnected, confirm }}>
      {children}
      {text && (
        <div className="toast">
          <span className="bd2"></span>
          <span>{text}</span>
          <button className="btn g s" style={{ color: '#9FB6AA', marginLeft: 'auto' }} onClick={() => setText(null)}>
            Dismiss
          </button>
        </div>
      )}
      {modal && (
        <div className="ovl">
          <div className="mod">
            <h3>{modal.title}</h3>
            <p className="lead" style={{ marginTop: 10 }}>{modal.body}</p>
            <div className="row" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setModal(null)}>Cancel</button>
              <button
                className={modal.danger ? 'btn d' : 'btn p'}
                onClick={() => {
                  setModal(null)
                  if (modal.onConfirm) modal.onConfirm()
                  else notConnected()
                }}
              >
                {modal.ok}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  )
}
