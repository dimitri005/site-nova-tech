import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { ConfirmContext, ToastContext } from './feedbackContext'
import type { ConfirmFn, ConfirmOptions, ToastApi } from './feedbackContext'

/* ---------- Notifications ---------- */
type ToastKind = 'success' | 'error' | 'info'
type Toast = { id: number; kind: ToastKind; message: string }


/* ---------- Confirmation ---------- */


export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])
  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++counter.current
    setToasts((current) => [...current.slice(-3), { id, kind, message }])
    window.setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4200)
  }, [dismiss])
  const toastApi = useMemo<ToastApi>(() => ({ success: (m) => push('success', m), error: (m) => push('error', m), info: (m) => push('info', m) }), [push])

  const [pending, setPending] = useState<{ options: ConfirmOptions; resolve: (value: boolean) => void } | null>(null)
  const confirm = useCallback<ConfirmFn>((options) => new Promise<boolean>((resolve) => setPending({ options, resolve })), [])
  const answer = (value: boolean) => { pending?.resolve(value); setPending(null) }

  return <ToastContext.Provider value={toastApi}><ConfirmContext.Provider value={confirm}>
    {children}
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => <div key={toast.id} className={`toast toast-${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'}>
        <span className="toast-icon" aria-hidden="true">{toast.kind === 'success' ? '✓' : toast.kind === 'error' ? '!' : 'i'}</span>
        <p>{toast.message}</p>
        <button type="button" onClick={() => dismiss(toast.id)} aria-label="Fermer la notification">×</button>
      </div>)}
    </div>
    <Modal open={pending !== null} title={pending?.options.title ?? ''} size="sm" onClose={() => answer(false)}
      footer={<><button type="button" className="secondary-action" onClick={() => answer(false)}>{pending?.options.cancelLabel ?? 'Annuler'}</button>
        <button type="button" data-autofocus className={pending?.options.tone === 'primary' ? 'primary-action' : 'primary-action danger-solid'} onClick={() => answer(true)}>{pending?.options.confirmLabel ?? 'Confirmer'}</button></>}>
      <div className="confirm-message">{pending?.options.message}</div>
    </Modal>
  </ConfirmContext.Provider></ToastContext.Provider>
}

