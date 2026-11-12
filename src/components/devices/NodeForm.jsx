import { useState } from 'react'
import { Button } from '../ui/Controls'
import { REPORT_INTERVALS } from '../../services/validation'

const EMPTY = { id: '', code: '', name: '', location: '', zone: '', attentionLevel: '', criticalLevel: '', reportIntervalSec: 30 }

function Field({ label, error, hint, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-300">
      {label}
      {children}
      {hint && !error && <span className="text-[11px] text-zinc-500">{hint}</span>}
      {error && <span role="alert" className="text-[11px] text-rose-400">{error}</span>}
    </label>
  )
}

const inputCls = 'min-h-10 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none disabled:opacity-50'

// Cadastro e edição de nó. A validação final é do serviço; erros voltam em `fieldErrors`.
export default function NodeForm({ node, onSubmit, onCancel }) {
  const editing = Boolean(node)
  const [values, setValues] = useState(editing ? { ...EMPTY, ...node } : EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const res = await onSubmit(values)
    setSaving(false)
    if (!res.ok) setErrors(res.fieldErrors ?? {})
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ID do dispositivo" error={errors.id} hint="Ex.: ESP32-NODE-05">
          <input className={inputCls} value={values.id} onChange={set('id')} disabled={editing} autoFocus={!editing} />
        </Field>
        <Field label="Código do ponto" error={errors.code} hint="Ex.: EST-05">
          <input className={inputCls} value={values.code} onChange={set('code')} disabled={editing} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Curso d’água" error={errors.name}><input className={inputCls} value={values.name} onChange={set('name')} autoFocus={editing} /></Field>
        <Field label="Local do sensor" error={errors.location}><input className={inputCls} value={values.location} onChange={set('location')} /></Field>
      </div>
      <Field label="Zona ou região" error={errors.zone}><input className={inputCls} value={values.zone} onChange={set('zone')} /></Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Cota de atenção (cm)" error={errors.attentionLevel}>
          <input className={inputCls} inputMode="decimal" value={values.attentionLevel} onChange={set('attentionLevel')} />
        </Field>
        <Field label="Cota crítica (cm)" error={errors.criticalLevel}>
          <input className={inputCls} inputMode="decimal" value={values.criticalLevel} onChange={set('criticalLevel')} />
        </Field>
        <Field label="Envio de leitura" error={errors.reportIntervalSec}>
          <select className={inputCls} value={values.reportIntervalSec} onChange={set('reportIntervalSec')}>
            {REPORT_INTERVALS.map((s) => <option key={s} value={s}>{s < 60 ? `a cada ${s} s` : `a cada ${s / 60} min`}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" disabled={saving}>{editing ? 'Salvar alterações' : 'Cadastrar nó'}</Button>
      </div>
    </form>
  )
}
