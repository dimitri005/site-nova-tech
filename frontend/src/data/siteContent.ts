export interface LocalizedText { fr: string; en: string }
export interface ServiceItem { slug: string; title: LocalizedText; summary: LocalizedText; description: LocalizedText; category: string }
export interface ProjectItem { slug: string; title: LocalizedText; category: string; image: string; client: string; description: LocalizedText; technologies: string[]; featured: boolean }
export interface CourseItem { slug: string; title: LocalizedText; summary: LocalizedText; duration: LocalizedText; price: LocalizedText; audience: LocalizedText; prerequisites: LocalizedText; program: LocalizedText[]; sessions: { date: LocalizedText; location: LocalizedText; remaining: number; status: 'open' | 'full' }[] }

export const services: ServiceItem[] = [
  { slug: 'sites-web', category: 'web', title: { fr: 'Développement de sites web', en: 'Website development' }, summary: { fr: 'Des sites professionnels pensés pour vos objectifs.', en: 'Professional websites built around your goals.' }, description: { fr: 'Nous créons des sites vitrines, des boutiques en ligne et des plateformes sur mesure, adaptés à votre activité et à vos clients.', en: 'We create business websites, online stores and custom platforms tailored to your work and your customers.' } },
  { slug: 'applications', category: 'mobile', title: { fr: 'Applications web et mobiles', en: 'Web and mobile applications' }, summary: { fr: 'Des outils métier accessibles sur tous vos écrans.', en: 'Business tools that work across your devices.' }, description: { fr: 'De l’application métier à l’expérience mobile, nous concevons des outils simples à utiliser et adaptés à vos processus.', en: 'From business software to mobile experiences, we build practical tools for your workflows.' } },
  { slug: 'formations', category: 'training', title: { fr: 'Formations en présentiel', en: 'In-person training' }, summary: { fr: 'Développez vos compétences avec une pratique guidée.', en: 'Build skills through guided, practical learning.' }, description: { fr: 'Programmation, bureautique et création graphique : des formations en présentiel adaptées à votre niveau.', en: 'Programming, office software and graphic design training delivered in person and matched to your level.' } },
  { slug: 'accompagnement', category: 'consulting', title: { fr: 'Accompagnement numérique', en: 'Digital consulting' }, summary: { fr: 'Un conseil concret à chaque étape de vos projets.', en: 'Practical guidance at every stage of your project.' }, description: { fr: 'Nous vous aidons à cadrer vos besoins, auditer vos outils et suivre vos projets numériques jusqu’à leur adoption.', en: 'We help you define needs, review tools and guide digital projects through delivery and adoption.' } },
  { slug: 'marketing-digital', category: 'marketing', title: { fr: 'Marketing digital', en: 'Digital marketing' }, summary: { fr: 'Faites connaître votre activité et mesurez vos résultats.', en: 'Grow your reach and understand what works.' }, description: { fr: 'Réseaux sociaux, publicité en ligne, référencement et création de contenu au service de votre visibilité.', en: 'Social media, online advertising, search visibility and content that support your growth.' } },
]

export const projects: ProjectItem[] = [
  { slug: 'portail-entreprise', title: { fr: 'Portail d’entreprise', en: 'Business portal' }, category: 'web', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', client: 'Client partenaire', description: { fr: 'Conception d’une présence digitale claire et adaptée aux besoins d’une équipe en croissance.', en: 'A clear digital presence tailored to a growing team.' }, technologies: ['React', 'UI/UX'], featured: true },
  { slug: 'campagne-numerique', title: { fr: 'Campagne numérique', en: 'Digital campaign' }, category: 'marketing', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', client: 'Marque locale', description: { fr: 'Une campagne de contenu et de visibilité construite autour des objectifs de la marque.', en: 'A content and visibility campaign shaped around the brand’s goals.' }, technologies: ['Content', 'Social media'], featured: true },
  { slug: 'outil-de-gestion', title: { fr: 'Outil de gestion', en: 'Management tool' }, category: 'mobile', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', client: 'PME partenaire', description: { fr: 'Un outil numérique pour simplifier le suivi des opérations quotidiennes.', en: 'A digital tool that simplifies day-to-day operations.' }, technologies: ['Web app', 'Workflow'], featured: true },
  { slug: 'atelier-creatif', title: { fr: 'Atelier créatif', en: 'Creative workshop' }, category: 'training', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', client: 'Communauté locale', description: { fr: 'Un atelier pratique pour transmettre les bases de la création visuelle numérique.', en: 'A hands-on workshop sharing the foundations of digital visual design.' }, technologies: ['Training', 'Design'], featured: false },
]

export const courses: CourseItem[] = [
  { slug: 'programmation-web', title: { fr: 'Programmation web', en: 'Web programming' }, summary: { fr: 'Apprenez à construire les fondations d’un site web moderne.', en: 'Learn to build the foundations of a modern website.' }, duration: { fr: '6 semaines · présentiel', en: '6 weeks · in person' }, price: { fr: 'Tarif communiqué sur demande', en: 'Price available on request' }, audience: { fr: 'Débutants et personnes en reconversion.', en: 'Beginners and career changers.' }, prerequisites: { fr: 'Utilisation de base d’un ordinateur.', en: 'Basic computer skills.' }, program: [{ fr: 'HTML et structure de page', en: 'HTML and page structure' }, { fr: 'CSS et mise en page responsive', en: 'CSS and responsive layouts' }, { fr: 'JavaScript et interactions', en: 'JavaScript and interactions' }], sessions: [{ date: { fr: 'Prochaine session à confirmer', en: 'Next session to be confirmed' }, location: { fr: 'Présentiel · Cameroun', en: 'In person · Cameroon' }, remaining: 8, status: 'open' }] },
  { slug: 'bureautique', title: { fr: 'Outils bureautiques', en: 'Office software' }, summary: { fr: 'Gagnez en autonomie avec les outils bureautiques du quotidien.', en: 'Build confidence with everyday office software.' }, duration: { fr: '4 semaines · présentiel', en: '4 weeks · in person' }, price: { fr: 'Tarif communiqué sur demande', en: 'Price available on request' }, audience: { fr: 'Étudiants, professionnels et entrepreneurs.', en: 'Students, professionals and business owners.' }, prerequisites: { fr: 'Aucun prérequis spécifique.', en: 'No specific prerequisites.' }, program: [{ fr: 'Traitement de texte', en: 'Word processing' }, { fr: 'Tableurs et calculs', en: 'Spreadsheets and calculations' }, { fr: 'Présentations professionnelles', en: 'Professional presentations' }], sessions: [{ date: { fr: 'Prochaine session à confirmer', en: 'Next session to be confirmed' }, location: { fr: 'Présentiel · Cameroun', en: 'In person · Cameroon' }, remaining: 12, status: 'open' }] },
  { slug: 'design-photoshop', title: { fr: 'Création graphique avec Photoshop', en: 'Graphic design with Photoshop' }, summary: { fr: 'Maîtrisez les bases de la retouche et de la création visuelle.', en: 'Learn the basics of image editing and visual design.' }, duration: { fr: '5 semaines · présentiel', en: '5 weeks · in person' }, price: { fr: 'Tarif communiqué sur demande', en: 'Price available on request' }, audience: { fr: 'Créatifs débutants et communicants.', en: 'Beginner creatives and communication teams.' }, prerequisites: { fr: 'Aisance avec un ordinateur.', en: 'Comfort using a computer.' }, program: [{ fr: 'Outils et espace de travail', en: 'Tools and workspace' }, { fr: 'Retouche photo', en: 'Photo editing' }, { fr: 'Création de visuels pour le web', en: 'Creating visuals for the web' }], sessions: [{ date: { fr: 'Prochaine session à confirmer', en: 'Next session to be confirmed' }, location: { fr: 'Présentiel · Cameroun', en: 'In person · Cameroon' }, remaining: 6, status: 'open' }] },
]

export const team = [
  { name: 'Équipe NOVA-TECH', role: { fr: 'Développement & conseil', en: 'Development & consulting' }, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', bio: { fr: 'Une équipe engagée dans la conception de solutions utiles et la transmission des compétences numériques.', en: 'A team committed to building useful solutions and sharing digital skills.' } },
  { name: 'Pôle formation', role: { fr: 'Accompagnement des apprenants', en: 'Learner support' }, image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', bio: { fr: 'Des formateurs qui privilégient la pratique, l’écoute et la progression de chaque apprenant.', en: 'Trainers focused on practical learning, listening and each learner’s progress.' } },
  { name: 'Pôle création', role: { fr: 'Design & marketing', en: 'Design & marketing' }, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', bio: { fr: 'Des profils créatifs qui rendent les marques plus visibles et les interfaces plus claires.', en: 'Creative people who make brands easier to find and interfaces easier to use.' } },
]

type EditableRecord = { id: string; title: string; titleEn?: string; descriptionFr?: string; descriptionEn?: string; status?: string; category?: string; client?: string; technologies?: string; image?: string }
function readEditableRecords(key: string): EditableRecord[] | undefined {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(`nova-admin-${key}`) || 'null')
    return Array.isArray(value) ? value as EditableRecord[] : undefined
  } catch { return undefined }
}

export function getServices(): ServiceItem[] {
  const records = readEditableRecords('services')
  if (!records) return services
  return records.filter((item) => item.status === 'Publié').map((item) => {
    const original = services.find((entry) => entry.slug === item.id)
    const fr = item.title || original?.title.fr || ''
    const en = item.titleEn || original?.title.en || fr
    const descriptionFr = item.descriptionFr || original?.description.fr || ''
    const descriptionEn = item.descriptionEn || original?.description.en || descriptionFr
    return { slug: item.id, title: { fr, en }, summary: { fr: descriptionFr, en: descriptionEn }, description: { fr: descriptionFr, en: descriptionEn }, category: item.category || original?.category || 'service' }
  })
}

export function getProjects(): ProjectItem[] {
  const records = readEditableRecords('projects')
  if (!records) return projects
  return records.filter((item) => item.status === 'Publié').map((item) => {
    const original = projects.find((entry) => entry.slug === item.id)
    const fr = item.title || original?.title.fr || ''
    const en = item.titleEn || original?.title.en || fr
    const descriptionFr = item.descriptionFr || original?.description.fr || ''
    const descriptionEn = item.descriptionEn || original?.description.en || descriptionFr
    return { slug: item.id, title: { fr, en }, category: item.category || original?.category || 'web', image: item.image || original?.image || '', client: item.client || original?.client || '', description: { fr: descriptionFr, en: descriptionEn }, technologies: item.technologies?.split(',').map((technology) => technology.trim()).filter(Boolean) || original?.technologies || [], featured: original?.featured ?? false }
  })
}

export function getCourses(): CourseItem[] {
  const records = readEditableRecords('courses')
  if (!records) return courses
  return records.filter((item) => item.status === 'Publié').map((item) => {
    const original = courses.find((entry) => entry.slug === item.id)
    const fr = item.title || original?.title.fr || ''
    const en = item.titleEn || original?.title.en || fr
    const summaryFr = item.descriptionFr || original?.summary.fr || ''
    const summaryEn = item.descriptionEn || original?.summary.en || summaryFr
    return { slug: item.id, title: { fr, en }, summary: { fr: summaryFr, en: summaryEn }, duration: original?.duration || { fr: 'Durée à préciser', en: 'Duration to be confirmed' }, price: original?.price || { fr: 'Tarif communiqué sur demande', en: 'Price available on request' }, audience: original?.audience || { fr: 'Public à préciser', en: 'Audience to be confirmed' }, prerequisites: original?.prerequisites || { fr: 'À préciser', en: 'To be confirmed' }, program: original?.program || [], sessions: original?.sessions || [] }
  })
}

export function getTeam(): typeof team {
  const records = readEditableRecords('team')
  if (!records) return team
  return records.filter((item) => item.status === 'Publié').map((item) => {
    const original = team.find((_, index) => `member-${index + 1}` === item.id)
    return { name: item.title || original?.name || '', role: { fr: item.category || original?.role.fr || '', en: item.category || original?.role.en || '' }, image: item.image || original?.image || '', bio: { fr: item.descriptionFr || original?.bio.fr || '', en: item.descriptionEn || original?.bio.en || '' } }
  })
}
