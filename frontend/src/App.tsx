import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/site-pages.css'

const AdminRoutes = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.AdminRoutes })))
const LocalizedPage = lazy(() => import('./pages/PublicPages').then((module) => ({ default: module.LocalizedPage })))
const NewsletterUnsubscribe = lazy(() => import('./pages/PublicPages').then((module) => ({ default: module.NewsletterUnsubscribe })))

function RouteFallback() {
  return <div className="page-loading" role="status">NOVA-TECH-SOLUTION</div>
}

function RouteNotFound() {
  return <main className="not-found"><span>404</span><h1>Page introuvable</h1><p>Cette adresse ne correspond à aucune page.</p><Link className="primary-action inline-action" to="/fr">Retour à l’accueil <span>→</span></Link></main>
}

export default function App() {
  const preferredLanguage = localStorage.getItem('nova-language') === 'en' ? 'en' : 'fr'
  return <ErrorBoundary><BrowserRouter><Suspense fallback={<RouteFallback/>}><Routes>
    <Route path="/" element={<Navigate to={`/${preferredLanguage}`} replace/>}/>
    <Route path="/admin/*" element={<AdminRoutes/>}/>
    <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe/>}/>
    <Route path="/:lang/*" element={<LocalizedPage/>}/>
    <Route path="*" element={<RouteNotFound/>}/>
  </Routes></Suspense></BrowserRouter></ErrorBoundary>
}
