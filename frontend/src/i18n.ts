import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1').replace(/\/$/, '')

const resources = {
  fr: { translation: {
    nav: { home: 'Accueil', about: 'À propos', services: 'Services', projects: 'Réalisations', training: 'Formations', team: 'Équipe', news: 'Actualités', contact: 'Contact', quote: 'Demander un devis', admin: 'Administration' },
    common: { learn: 'En savoir plus', viewAll: 'Voir tout', readMore: 'Lire la suite', send: 'Envoyer la demande', demo: 'Mode démonstration frontend : les données restent dans ce navigateur et aucun e-mail n’est envoyé.', name: 'Nom complet', email: 'Adresse e-mail', phone: 'Téléphone', message: 'Votre message', category: 'Catégorie', all: 'Toutes', search: 'Rechercher', back: 'Retour', next: 'Suivant' },
    home: { eyebrow: 'Solutions numériques au Cameroun', title: 'Le numérique au service de votre réussite.', intro: 'NOVA-TECH-SOLUTION accompagne les entreprises, associations et particuliers dans leurs projets numériques, de la conception à la mise en œuvre.', services: 'Nos pôles d’expertise', projects: 'Des projets qui font avancer', training: 'Apprenez avec nos formations en présentiel', trainingIntro: 'Programmation, bureautique et création graphique : développez des compétences utiles grâce à la pratique.', team: 'Une équipe engagée à vos côtés', cta: 'Parlons de votre projet', contact: 'Un projet en tête ? Échangeons.', projectsEyebrow: 'RÉALISATIONS RÉCENTES', projectsIntro: 'Des solutions numériques conçues pour répondre à des besoins concrets.', aboutTitle: 'Nous donnons vie à vos idées, de la conception à la réalisation.', aboutText: 'Une approche professionnelle de la technologie, pensée pour les besoins de nos clients.', missionTitle: 'Votre réussite grâce aux meilleures solutions numériques', missionOne: 'Nous nous efforçons constamment d’offrir le meilleur service à nos clients.', missionTwo: 'Une équipe et des technologies adaptées à vos objectifs.', missionThree: 'Un plan clair, construit autour de votre vision.', whyTitle: 'Notre objectif : des services informatiques utiles aux entreprises.', news: 'Conseils et actualités', discover: 'Découvrir nos services' },
    pages: { about: 'À propos', services: 'Nos services', projects: 'Nos réalisations', training: 'Nos formations', team: 'Notre équipe', contact: 'Contactez-nous', blog: 'Actualités', legal: 'Mentions légales', privacy: 'Politique de confidentialité', quote: 'Demander un devis', notFound: 'Page introuvable' },
    about: { intro: 'Nous aidons les organisations à tirer le meilleur du numérique grâce à des solutions utiles, accessibles et conçues pour durer.', mission: 'Notre mission', missionText: 'Concevoir des outils et accompagner les équipes pour transformer des idées en solutions numériques concrètes.', vision: 'Notre vision', visionText: 'Un environnement où chaque entreprise et chaque apprenant peut réussir grâce à la technologie.', values: 'Nos valeurs', valuesText: 'Écoute, qualité, transparence et transmission du savoir.' },
    forms: { serviceType: 'Type de service', choose: 'Choisir une option', need: 'Décrivez votre besoin', budget: 'Budget indicatif', deadline: 'Délai souhaité', consent: 'J’accepte que mes informations soient utilisées pour répondre à ma demande.', success: 'Merci. Votre demande a été enregistrée dans cette démonstration locale.', course: 'Formation', session: 'Session', selectSession: 'Choisir une session' },
    admin: { title: 'Espace administration', subtitle: 'Gestion de contenu — démonstration frontend', login: 'Connexion', dashboard: 'Tableau de bord', content: 'Contenus', requests: 'Demandes', settings: 'Paramètres', logout: 'Déconnexion', demoAccess: 'Accès de démonstration', email: 'E-mail', password: 'Mot de passe', signIn: 'Se connecter', welcome: 'Bienvenue dans votre espace', recent: 'Activité récente', create: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler', titleField: 'Titre', status: 'Statut', actions: 'Actions', noData: 'Aucune donnée pour le moment', localNotice: 'Les changements sont enregistrés uniquement dans le stockage local du navigateur. Cette interface ne remplace pas une authentification serveur.' },
  } },
  en: { translation: {
    nav: { home: 'Home', about: 'About', services: 'Services', projects: 'Projects', training: 'Training', team: 'Team', news: 'News', contact: 'Contact', quote: 'Request a quote', admin: 'Admin' },
    common: { learn: 'Learn more', viewAll: 'View all', readMore: 'Read more', send: 'Send request', demo: 'Frontend demo: data stays in this browser and no email is sent.', name: 'Full name', email: 'Email address', phone: 'Phone', message: 'Your message', category: 'Category', all: 'All', search: 'Search', back: 'Back', next: 'Next' },
    home: { eyebrow: 'Digital solutions in Cameroon', title: 'Technology that moves your business forward.', intro: 'NOVA-TECH-SOLUTION helps businesses, organizations and individuals plan and deliver practical digital projects, from concept to launch.', services: 'Our areas of expertise', projects: 'Work that moves business forward', training: 'Learn with our in-person training', trainingIntro: 'Programming, office tools and graphic design: build practical skills through hands-on learning.', team: 'A committed team by your side', cta: 'Let’s discuss your project', contact: 'Have a project in mind? Let’s talk.', projectsEyebrow: 'RECENT WORK', projectsIntro: 'Digital solutions designed to address real needs.', aboutTitle: 'We bring your ideas to life, from concept to delivery.', aboutText: 'A professional approach to technology, designed around our clients’ needs.', missionTitle: 'Your success through practical digital solutions', missionOne: 'We work hard to deliver excellent service to our clients.', missionTwo: 'A team and technology shaped around your goals.', missionThree: 'A clear plan built around your vision.', whyTitle: 'Our goal: useful technology services for businesses.', news: 'Insights and updates', discover: 'Explore our services' },
    pages: { about: 'About us', services: 'Our services', projects: 'Our projects', training: 'Our training', team: 'Our team', contact: 'Contact us', blog: 'News', legal: 'Legal notice', privacy: 'Privacy policy', quote: 'Request a quote', notFound: 'Page not found' },
    about: { intro: 'We help organizations get more from technology with useful, accessible digital solutions built to last.', mission: 'Our mission', missionText: 'We design tools and support teams to turn ideas into practical digital solutions.', vision: 'Our vision', visionText: 'A world where every business and learner can succeed with technology.', values: 'Our values', valuesText: 'Listening, quality, transparency and sharing knowledge.' },
    forms: { serviceType: 'Service type', choose: 'Choose an option', need: 'Describe your needs', budget: 'Estimated budget', deadline: 'Desired timeline', consent: 'I agree that my information may be used to respond to my request.', success: 'Thank you. Your request was saved in this local demo.', course: 'Training course', session: 'Session', selectSession: 'Choose a session' },
    admin: { title: 'Administration', subtitle: 'Content management — frontend demo', login: 'Sign in', dashboard: 'Dashboard', content: 'Content', requests: 'Requests', settings: 'Settings', logout: 'Sign out', demoAccess: 'Demo access', email: 'Email', password: 'Password', signIn: 'Sign in', welcome: 'Welcome to your workspace', recent: 'Recent activity', create: 'Add new', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', titleField: 'Title', status: 'Status', actions: 'Actions', noData: 'No data yet', localNotice: 'Changes are saved only in this browser. This interface does not replace server-side authentication.' },
  } },
}

const initialLanguage = localStorage.getItem('nova-language') === 'en' ? 'en' : 'fr'

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  react: { bindI18nStore: 'added' },
})

async function loadCatalog(locale: 'fr' | 'en') {
  try {
    const response = await fetch(`${apiBaseUrl}/i18n/${locale}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    })
    if (!response.ok) return

    const payload = await response.json() as { data?: unknown }
    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) return
    i18n.addResourceBundle(locale, 'translation', payload.data, true, true)
  } catch {
    // Keep the bundled catalog when the backend is unavailable.
  }
}

void Promise.all([loadCatalog('fr'), loadCatalog('en')])

export default i18n
