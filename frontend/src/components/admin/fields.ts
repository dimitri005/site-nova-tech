import * as Yup from 'yup'

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'url' | 'email' | 'checkbox' | 'select' | 'list' | 'image' | 'password'
export type Field = {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
  min?: number
  max?: number
  maxLength?: number
  /** Occupe toute la largeur de la grille (par défaut : textarea, list et image). */
  wide?: boolean
}
export type Row = Record<string, unknown> & { id?: string; slug?: string }
export type FormValues = Record<string, string | boolean>

const REQUIRED = 'Ce champ est obligatoire.'
const isUrlOrMedia = (value?: string | null) => {
  if (!value) return true
  if (value.startsWith('/')) return true
  try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false }
}

export function fieldValue(field: Field, value: unknown): string | boolean {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'list') return Array.isArray(value) ? value.join('\n') : String(value ?? '')
  if (field.type === 'datetime-local') {
    if (!value) return ''
    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return ''
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
  }
  return value == null ? '' : String(value)
}

export function initialValues(fields: Field[], initial?: Row | null): FormValues {
  return Object.fromEntries(fields.map((field) => [field.name, fieldValue(field, initial?.[field.name])]))
}

export function buildSchema(fields: Field[]) {
  const shape: Record<string, Yup.Schema> = {}
  for (const field of fields) {
    let rule: Yup.Schema
    switch (field.type) {
      case 'checkbox': rule = Yup.boolean(); break
      case 'number': {
        let number = Yup.number().transform((value, original) => (original === '' || original == null ? null : value)).nullable().typeError('Saisissez un nombre valide.')
        if (field.min != null) number = number.min(field.min, `La valeur minimale est ${field.min}.`)
        if (field.max != null) number = number.max(field.max, `La valeur maximale est ${field.max}.`)
        rule = field.required ? number.required(REQUIRED) : number
        break
      }
      case 'email': {
        const email = Yup.string().trim().email('Adresse e-mail invalide.').max(254, 'Maximum 254 caractères.')
        rule = field.required ? email.required(REQUIRED) : email
        break
      }
      case 'url': case 'image': {
        const url = Yup.string().trim().test('url', 'Saisissez une URL valide (https://…) ou un chemin /media/…', isUrlOrMedia)
        rule = field.required ? url.required(REQUIRED) : url
        break
      }
      case 'password': {
        const password = Yup.string().min(12, '12 caractères minimum.').max(200, 'Maximum 200 caractères.')
          .matches(/[a-z]/, 'Ajoutez une minuscule.').matches(/[A-Z]/, 'Ajoutez une majuscule.').matches(/\d/, 'Ajoutez un chiffre.')
        rule = field.required ? password.required(REQUIRED) : password.transform((value) => value || undefined)
        break
      }
      default: {
        let text = Yup.string().trim()
        if (field.maxLength) text = text.max(field.maxLength, `Maximum ${field.maxLength} caractères.`)
        rule = field.required ? text.required(REQUIRED) : text
      }
    }
    shape[field.name] = rule
  }
  return Yup.object(shape)
}

/** Convertit les valeurs Formik en corps JSON attendu par l'API. */
export function toBody(values: FormValues, fields: Field[]): Row {
  const body: Row = {}
  for (const field of fields) {
    const value = values[field.name]
    if (field.type === 'checkbox') body[field.name] = Boolean(value)
    else if (field.type === 'list') body[field.name] = String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    else if (field.type === 'number') body[field.name] = value === '' || value == null ? null : Number(value)
    else if (field.type === 'datetime-local') body[field.name] = value ? new Date(String(value)).toISOString() : null
    else body[field.name] = typeof value === 'string' ? (value.trim() === '' ? null : value.trim()) : value
  }
  return body
}
