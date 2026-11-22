import { useState } from 'react'
import { Formik, Form } from 'formik'
import type { FormikErrors, FormikProps } from 'formik'
import { ApiError, apiSend, mapFieldErrors } from '../../api/client'
import type { MediaRecord } from '../../api/types'
import { buildSchema, initialValues, toBody } from './fields'
import type { Field, FormValues, Row } from './fields'

type EntityFormProps = {
  fields: Field[]
  initial?: Row | null
  submitLabel?: string
  onCancel: () => void
  onSubmit: (body: Row) => Promise<void>
  /** Règles transverses (ex. date de fin après la date de début). */
  validate?: (values: FormValues) => FormikErrors<FormValues>
  /** Notifie le parent de l'état d'envoi (verrouille la modale). */
  onBusyChange?: (busy: boolean) => void
}

async function uploadImage(file: File): Promise<MediaRecord> {
  const body = new FormData()
  body.append('file', file)
  return apiSend<MediaRecord>('/management/media', 'POST', body)
}

export function EntityForm({ fields, initial, submitLabel = 'Enregistrer', onCancel, onSubmit, validate, onBusyChange }: EntityFormProps) {
  const [uploading, setUploading] = useState('')
  return <Formik<FormValues>
    initialValues={initialValues(fields, initial)}
    validationSchema={buildSchema(fields)}
    validate={validate}
    enableReinitialize={false}
    onSubmit={async (values, helpers) => {
      helpers.setStatus(undefined)
      onBusyChange?.(true)
      try {
        await onSubmit(toBody(values, fields))
      } catch (reason) {
        if (reason instanceof ApiError && Object.keys(reason.fields).length) {
          const mapped = mapFieldErrors(reason.fields, fields.map((field) => field.name))
          helpers.setErrors(mapped as FormikErrors<FormValues>)
          helpers.setTouched(Object.fromEntries(Object.keys(mapped).map((key) => [key, true])), false)
          if (Object.keys(mapped).length < Object.keys(reason.fields).length) helpers.setStatus(reason.message)
        } else helpers.setStatus(reason instanceof ApiError ? reason.message : 'Enregistrement impossible. Réessayez.')
      } finally {
        onBusyChange?.(false)
      }
    }}
  >
    {(formik) => <Form className="entity-form" noValidate>
      <div className="entity-form-grid">{fields.map((field) => <FieldControl key={field.name} field={field} formik={formik} uploading={uploading === field.name}
        onUpload={async (file) => {
          setUploading(field.name)
          try { const asset = await uploadImage(file); await formik.setFieldValue(field.name, asset.url); formik.setFieldTouched(field.name, true, false) }
          catch (reason) { formik.setStatus(reason instanceof ApiError ? reason.message : 'Téléversement impossible.') }
          finally { setUploading('') }
        }}/>)}</div>
      {formik.status && <p className="form-error form-banner" role="alert">{String(formik.status)}</p>}
      <div className="modal-actions">
        <button type="button" className="secondary-action" onClick={onCancel} disabled={formik.isSubmitting}>Annuler</button>
        <button type="submit" className="primary-action" disabled={formik.isSubmitting || Boolean(uploading)}>{formik.isSubmitting ? 'Enregistrement…' : submitLabel}</button>
      </div>
    </Form>}
  </Formik>
}

function FieldControl({ field, formik, onUpload, uploading }: { field: Field; formik: FormikProps<FormValues>; onUpload: (file: File) => Promise<void>; uploading: boolean }) {
  const error = formik.touched[field.name] ? (formik.errors[field.name] as string | undefined) : undefined
  const id = `field-${field.name}`
  const errorId = `${id}-error`
  const common = { id, name: field.name, onChange: formik.handleChange, onBlur: formik.handleBlur, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : field.help ? `${id}-help` : undefined }
  const value = formik.values[field.name]
  const wide = field.wide ?? ['textarea', 'list', 'image'].includes(field.type ?? '')

  if (field.type === 'checkbox') return <div className="entity-field entity-field-check">
    <label className="switch"><input type="checkbox" {...common} checked={Boolean(value)}/><span className="switch-track" aria-hidden="true"/><span>{field.label}</span></label>
    {field.help && <small className="field-help" id={`${id}-help`}>{field.help}</small>}
  </div>

  return <div className={`entity-field${wide ? ' entity-field-wide' : ''}${error ? ' field-has-error' : ''}`}>
    <label htmlFor={id}>{field.label}{field.required && <b aria-hidden="true"> *</b>}</label>
    {field.type === 'textarea' || field.type === 'list'
      ? <textarea {...common} rows={field.type === 'list' ? 3 : 4} value={String(value ?? '')} placeholder={field.placeholder}/>
      : field.type === 'select'
        ? <select {...common} value={String(value ?? '')}><option value="">Sélectionner…</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        : field.type === 'image'
          ? <div className="image-field">
            <input {...common} type="text" value={String(value ?? '')} placeholder={field.placeholder ?? 'https://… ou téléversez un fichier'}/>
            <label className="image-upload-button">{uploading ? 'Envoi…' : 'Téléverser'}
              <input type="file" accept="image/jpeg,image/png" disabled={uploading} aria-label={`Téléverser ${field.label}`}
                onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; if (file) void onUpload(file).finally(() => { input.value = '' }) }}/></label>
            {value && <img className="image-field-preview" src={String(value)} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} onLoad={(event) => { event.currentTarget.style.display = '' }}/>}
          </div>
          : <input {...common} type={field.type ?? 'text'} value={String(value ?? '')} placeholder={field.placeholder} step={field.type === 'number' ? 'any' : undefined} autoComplete={field.type === 'password' ? 'new-password' : undefined}/>}
    {field.help && !error && <small className="field-help" id={`${id}-help`}>{field.help}</small>}
    {error && <small className="field-validation-error" id={errorId} role="alert">{error}</small>}
  </div>
}
