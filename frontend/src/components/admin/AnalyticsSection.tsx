import { useState } from 'react'
import { ApiState } from '../../api/ApiState'
import { useApiData } from '../../api/hooks'
import type { DashboardAnalyticsRecord } from '../../api/types'
import { BarList, ChartCard, DonutChart, FillMeter, LegendKey, Sparkline, TrendChart } from './charts'
import type { TrendSeries } from './charts'
import { SERIES, delta, nf, shortDate } from './chartTheme'
import { statusLabel } from './format'
import { AnalyticsSkeleton } from '../Skeleton'

const PERIODS = [{ days: 7, label: '7 jours' }, { days: 30, label: '30 jours' }, { days: 90, label: '90 jours' }]
const TREND: TrendSeries[] = [
  { key: 'messages', label: 'Messages', color: SERIES.blue },
  { key: 'quotes', label: 'Demandes de devis', color: SERIES.orange },
  { key: 'enrollments', label: 'Pré-inscriptions', color: SERIES.aqua },
]

function Kpi({ label, value, previous, values, color, hint }: { label: string; value: number; previous: number; values: number[]; color: string; hint: string }) {
  const change = delta(value, previous)
  return <article className="kpi-tile">
    <small>{label}</small>
    <div className="kpi-main"><strong>{nf.format(value)}</strong>
      <span className={`kpi-delta kpi-${change.direction}`} title={`Période précédente : ${nf.format(previous)}`}>{change.direction === 'up' ? '▲' : change.direction === 'down' ? '▼' : '■'} {change.pct === null ? 'nouveau' : `${change.pct > 0 ? '+' : ''}${change.pct} %`}</span></div>
    <Sparkline values={values} color={color}/>
    <i>{hint}</i>
  </article>
}

export function AnalyticsSection() {
  const [days, setDays] = useState(30)
  const { data, loading, error, reload } = useApiData<DashboardAnalyticsRecord>(`/management/dashboard/analytics?days=${days}`)
  const series = data?.series ?? []
  const period = data ? `${shortDate(data.from)} – ${shortDate(data.to)}` : ''
  const sum = (key: 'messages' | 'quotes' | 'enrollments' | 'subscribers') => series.map((point) => point[key])

  return <section className="admin-dashboard-section analytics" aria-label="Analyse de l’activité" aria-busy={loading}>
    <div className="admin-section-heading">
      <div><h2>Analyse de l’activité</h2><p>{period ? `Du ${period}, comparée à la période précédente.` : 'Évolution des demandes et des inscriptions.'}</p></div>
      <div className="segmented" role="group" aria-label="Période d’analyse">{PERIODS.map((item) => <button key={item.days} type="button" aria-pressed={days === item.days} className={days === item.days ? 'is-active' : ''} onClick={() => setDays(item.days)}>{item.label}</button>)}</div>
    </div>
    <ApiState loading={false} error={error} onRetry={reload}/>
    {loading && !data ? <AnalyticsSkeleton/> : data && <>
      <div className="kpi-grid">
        <Kpi label="Messages reçus" value={data.totals.messages} previous={data.previousTotals.messages} values={sum('messages')} color={SERIES.blue} hint={`sur ${data.days} jours`}/>
        <Kpi label="Demandes de devis" value={data.totals.quotes} previous={data.previousTotals.quotes} values={sum('quotes')} color={SERIES.orange} hint={`sur ${data.days} jours`}/>
        <Kpi label="Pré-inscriptions" value={data.totals.enrollments} previous={data.previousTotals.enrollments} values={sum('enrollments')} color={SERIES.aqua} hint={`sur ${data.days} jours`}/>
        <Kpi label="Nouveaux abonnés" value={data.totals.subscribers} previous={data.previousTotals.subscribers} values={sum('subscribers')} color={SERIES.blue} hint="newsletter"/>
      </div>

      <ChartCard className="chart-wide" title="Activité quotidienne" subtitle="Messages, devis et pré-inscriptions reçus chaque jour"
        legend={TREND.map((item) => <LegendKey key={item.key} color={item.color} label={item.label} value={data.totals[item.key as 'messages' | 'quotes' | 'enrollments']}/>)}
        table={{ columns: ['Date', ...TREND.map((item) => item.label)], rows: series.map((point) => [shortDate(point.date), point.messages, point.quotes, point.enrollments]) }}>
        <TrendChart data={series as unknown as Record<string, number | string>[]} series={TREND}/>
      </ChartCard>

      <div className="chart-grid">
        <ChartCard title="Demandes de devis par statut" subtitle="Répartition sur la période"
          table={{ columns: ['Statut', 'Devis'], rows: data.quoteStatus.map((item) => [statusLabel(item.label), item.value]) }}>
          {data.quoteStatus.length ? <DonutChart data={data.quoteStatus} centerLabel="devis" labelOf={statusLabel}/> : <p className="chart-empty">Aucune demande de devis sur la période.</p>}
        </ChartCard>
        <ChartCard title="Messages par statut" subtitle="Traitement de la boîte de réception"
          table={{ columns: ['Statut', 'Messages'], rows: data.messageStatus.map((item) => [statusLabel(item.label), item.value]) }}>
          {data.messageStatus.length ? <DonutChart data={data.messageStatus} centerLabel="messages" labelOf={statusLabel}/> : <p className="chart-empty">Aucun message sur la période.</p>}
        </ChartCard>
        <ChartCard title="Devis par type de service" subtitle="Les services les plus demandés"
          table={{ columns: ['Service', 'Devis'], rows: data.quotesByService.map((item) => [item.label, item.value]) }}>
          {data.quotesByService.length ? <BarList data={data.quotesByService} color={SERIES.blue} unit="Devis"/> : <p className="chart-empty">Aucune donnée sur la période.</p>}
        </ChartCard>
        <ChartCard title="Pré-inscriptions par formation" subtitle="Hors inscriptions annulées"
          table={{ columns: ['Formation', 'Pré-inscriptions'], rows: data.enrollmentsByCourse.map((item) => [item.label, item.value]) }}>
          {data.enrollmentsByCourse.length ? <BarList data={data.enrollmentsByCourse} color={SERIES.aqua} unit="Pré-inscriptions"/> : <p className="chart-empty">Aucune donnée sur la période.</p>}
        </ChartCard>
      </div>

      <ChartCard className="chart-wide" title="Remplissage des sessions à venir" subtitle="Places réservées sur la capacité de chaque session ouverte"
        table={{ columns: ['Session', 'Réservées', 'Capacité'], rows: data.sessionFill.map((item) => [item.label, item.reserved, item.capacity]) }}>
        {data.sessionFill.length ? <div className="meter-grid">{data.sessionFill.map((item) => <FillMeter key={item.label} {...item}/>)}</div> : <p className="chart-empty">Aucune session ouverte.</p>}
      </ChartCard>
    </>}
  </section>
}
