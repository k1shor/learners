import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './ToastContext'

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, tone }])
    timers.current.set(id, window.setTimeout(() => dismiss(id), 4000))
  }, [dismiss])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.tone === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} className="shrink-0 text-lg leading-4" aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

