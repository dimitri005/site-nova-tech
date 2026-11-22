import { useState } from 'react'
import type { ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORICAL, GRID, INK, SURFACE, compact, longDate, nf, shortDate } from './chartTheme'

type TableData = { columns: string[]; rows: (string | number)[][] }

/** Carte de graphique : titre, sous-titre, bascule graphique / tableau (alternative accessible). */
export function ChartCard({ title, subtitle, table, legend, children, className = '' }: { title: string; subtitle?: string; table: TableData; legend?: ReactNode; children: ReactNode; className?: string }) {
  const [asTable, setAsTable] = useState(false)
  return <section className={`chart-card ${className}`} aria-label={title}>
    <header><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
      <button type="button" className="chart-toggle" aria-pressed={asTable} onClick={() => setAsTable((value) => !value)}>{asTable ? 'Voir le graphique' : 'Voir le tableau'}</button></header>
    {legend && !asTable && <div className="chart-legend">{legend}</div>}
    {asTable
      ? <div className="chart-table"><table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{typeof cell === 'number' ? nf.format(cell) : cell}</td>)}</tr>)}</tbody></table></div>
      : children}
  </section>
}

export function LegendKey({ color, label, value }: { color: string; label: string; value?: string | number }) {
  return <span className="legend-item"><i style={{ background: color }} aria-hidden="true"/>{label}{value !== undefined && <b>{typeof value === 'number' ? nf.format(value) : value}</b>}</span>
}

type TooltipRow = { name?: string | number; value?: number | string; color?: string }
function TooltipBox({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return <div className="chart-tooltip" role="status">
    {title && <strong className="tt-title">{title}</strong>}
    {rows.map((row) => <div className="tt-row" key={String(row.name)}><i style={{ background: row.color }} aria-hidden="true"/><b>{typeof row.value === 'number' ? nf.format(row.value) : row.value}</b><span>{row.name}</span></div>)}
  </div>
}

export type TrendSeries = { key: string; label: string; color: string }

/** Courbes (2 px) avec aplat à 10 %, repère vertical et infobulle regroupant toutes les séries. */
export function TrendChart({ data, series, height = 300 }: { data: Record<string, number | string>[]; series: TrendSeries[]; height?: number }) {
  return <div className="chart-box" style={{ height }}><ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -8 }}>
      <defs>{series.map((item) => <linearGradient id={`fill-${item.key}`} key={item.key} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={item.color} stopOpacity={0.16}/><stop offset="100%" stopColor={item.color} stopOpacity={0.02}/></linearGradient>)}</defs>
      <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1}/>
      <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: INK.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={28} tickMargin={8}/>
      <YAxis allowDecimals={false} tick={{ fill: INK.muted, fontSize: 11 }} tickLine={false} axisLine={false} width={40} tickFormatter={compact}/>
      <Tooltip cursor={{ stroke: INK.muted, strokeWidth: 1 }} content={({ active, payload, label }) => active && payload?.length ? <TooltipBox title={longDate(String(label))} rows={payload.map((item) => ({ name: item.name, value: item.value as number, color: item.color }))}/> : null}/>
      {series.map((item) => <Area key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={2} fill={`url(#fill-${item.key})`} dot={false}
        activeDot={{ r: 5, fill: item.color, stroke: SURFACE, strokeWidth: 2 }} isAnimationActive={false}/>)}
    </AreaChart>
  </ResponsiveContainer></div>
}

/** Anneau : un tout réparti en catégories (≤ 6), total au centre, libellés en encre neutre. */
export function DonutChart({ data, centerLabel, labelOf = (label: string) => label }: { data: { label: string; value: number }[]; centerLabel: string; labelOf?: (label: string) => string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return <div className="donut">
    <div className="donut-plot"><ResponsiveContainer width="100%" height="100%"><PieChart>
      <Pie data={data} dataKey="value" nameKey="label" innerRadius="64%" outerRadius="92%" paddingAngle={2} stroke={SURFACE} strokeWidth={2} isAnimationActive={false}>
        {data.map((item, index) => <Cell key={item.label} fill={CATEGORICAL[index % CATEGORICAL.length]}/>)}
      </Pie>
      <Tooltip content={({ active, payload }) => active && payload?.length ? <TooltipBox rows={[{ name: labelOf(String(payload[0].name)), value: payload[0].value as number, color: payload[0].payload?.fill ?? CATEGORICAL[0] }]}/> : null}/>
    </PieChart></ResponsiveContainer>
      <div className="donut-center"><strong>{nf.format(total)}</strong><span>{centerLabel}</span></div></div>
    <ul className="donut-legend">{data.map((item, index) => <li key={item.label}><i style={{ background: CATEGORICAL[index % CATEGORICAL.length] }} aria-hidden="true"/><span>{labelOf(item.label)}</span><b>{nf.format(item.value)}</b><em>{total ? Math.round((item.value / total) * 100) : 0} %</em></li>)}</ul>
  </div>
}

/** Barres horizontales à une série : 16 px d'épaisseur, bout arrondi 4 px, valeur au bout de la barre. */
export function BarList({ data, color, unit = '' }: { data: { label: string; value: number }[]; color: string; unit?: string }) {
  const height = Math.max(120, data.length * 44 + 16)
  return <div className="chart-box" style={{ height }}><ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }} barCategoryGap={14}>
      <CartesianGrid horizontal={false} stroke={GRID} strokeWidth={1}/>
      <XAxis type="number" allowDecimals={false} tick={{ fill: INK.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={compact}/>
      <YAxis type="category" dataKey="label" width={190} tick={{ fill: INK.secondary, fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID }} tickFormatter={(value: string) => (value.length > 28 ? `${value.slice(0, 27)}…` : value)}/>
      <Tooltip cursor={{ fill: 'rgba(51, 114, 183, .06)' }} content={({ active, payload }) => active && payload?.length ? <TooltipBox title={String(payload[0].payload.label)} rows={[{ name: unit || 'Total', value: payload[0].value as number, color }]}/> : null}/>
      <Bar dataKey="value" fill={color} barSize={16} radius={[0, 4, 4, 0]} isAnimationActive={false}>
        <LabelList dataKey="value" position="right" fill={INK.primary} fontSize={12} fontWeight={700} formatter={(value: unknown) => nf.format(Number(value))}/>
      </Bar>
    </BarChart>
  </ResponsiveContainer></div>
}

/** Jauge de remplissage : la couleur suit la gravité (accent → alerte → critique), piste = teinte claire du même ton. */
export function FillMeter({ label, reserved, capacity }: { label: string; reserved: number; capacity: number }) {
  const ratio = capacity > 0 ? reserved / capacity : 0
  const tone = ratio >= 0.95 ? 'critical' : ratio >= 0.75 ? 'warning' : 'ok'
  return <div className="meter-row">
    <div className="meter-head"><span title={label}>{label}</span><b>{reserved}/{capacity} · {Math.round(ratio * 100)} %</b></div>
    <div className={`meter meter-${tone}`} role="meter" aria-valuemin={0} aria-valuemax={capacity} aria-valuenow={reserved} aria-label={label}><i style={{ width: `${Math.min(100, Math.round(ratio * 100))}%` }}/></div>
  </div>
}

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const data = values.map((value, index) => ({ index, value }))
  return <div className="sparkline" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} dot={false} isAnimationActive={false}/>
  </AreaChart></ResponsiveContainer></div>
}
