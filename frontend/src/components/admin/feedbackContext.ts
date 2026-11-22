import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export type ToastApi = { success: (message: string) => void; error: (message: string) => void; info: (message: string) => void }
export type ConfirmOptions = { title: string; message: ReactNode; confirmLabel?: string; cancelLabel?: string; tone?: 'danger' | 'primary' }
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

export const ToastContext = createContext<ToastApi | null>(null)
export const ConfirmContext = createContext<ConfirmFn | null>(null)

export function useToast(): ToastApi {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast doit être utilisé dans FeedbackProvider')
  return value
}

export function useConfirm(): ConfirmFn {
  const value = useContext(ConfirmContext)
  if (!value) throw new Error('useConfirm doit être utilisé dans FeedbackProvider')
  return value
}
