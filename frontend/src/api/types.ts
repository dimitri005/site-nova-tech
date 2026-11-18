export interface ServiceRecord {
  id: string; slug: string; category: string; titleFr: string; titleEn: string
  descriptionFr: string; descriptionEn: string; imageUrl?: string; displayOrder: number; published: boolean
}

export interface ProjectRecord {
  id: string; slug: string; titleFr: string; titleEn: string; descriptionFr: string; descriptionEn: string
  category: string; clientName?: string; technologies: string[]; galleryUrls: string[]; coverImageUrl?: string
  projectDate?: string; projectUrl?: string; featured: boolean; published: boolean
}

export interface TrainingSessionRecord {
  id: string; courseId: string; courseTitleFr?: string; startsAt: string; endsAt: string; venue: string
  capacity: number; reservedPlaces: number; placesRemaining: number; status: 'OPEN' | 'FULL' | 'CLOSED' | 'COMPLETED'
  [key: string]: unknown
}

export interface TrainingRecord {
  id: string; slug: string; titleFr: string; titleEn: string; descriptionFr: string; descriptionEn: string
  objectivesFr?: string; objectivesEn?: string; audienceFr?: string; audienceEn?: string
  prerequisitesFr?: string; prerequisitesEn?: string; programFr?: string; programEn?: string
  durationHours?: number; indicativePrice?: number; currency?: string; imageUrl?: string; published: boolean
}

export interface TeamRecord {
  id: string; slug: string; fullName: string; positionFr: string; positionEn: string
  biographyFr: string; biographyEn: string; photoUrl?: string; category: 'FOUNDER' | 'STAFF'
  linkedInUrl?: string; facebookUrl?: string; displayOrder: number; published: boolean
}

export interface ArticleRecord {
  id: string; slug: string; titleFr: string; titleEn: string; excerptFr: string; excerptEn: string
  bodyFr: string; bodyEn: string; category: string; coverImageUrl?: string; status: 'DRAFT' | 'PUBLISHED'
  publishedAt?: string
}

export interface StaticPageRecord {
  id?: string; slug: string; titleFr: string; titleEn: string; bodyFr: string; bodyEn: string; published: boolean
}

export interface TrainingEnrollmentRecord {
  id: string; sessionId: string; fullName: string; email: string; phone: string
  preferredLanguage: string; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string
}

export interface ContactRecord {
  id: string; fullName: string; email: string; phone?: string; subject: string; message: string
  language: string; status: 'NEW' | 'READ' | 'RESOLVED'; createdAt: string
}

export interface QuoteRecord {
  id: string; fullName: string; email: string; phone?: string; serviceType: string; projectDescription: string
  budgetRange?: string; desiredDeadline?: string; status: 'NEW' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED'
  internalNotes?: string; createdAt: string
}

export interface AdminUserRecord {
  id: string; email: string; displayName: string; roles: string[]; enabled: boolean
  [key: string]: unknown
}

export interface MediaRecord {
  id: string; url: string; originalName: string; contentType: string; fileSize: number
  altFr?: string; altEn?: string; createdAt: string
}

export interface DashboardRecord {
  unreadMessages: number; pendingQuotes: number; recentEnrollments: number
  publishedProjects: number; publishedArticles: number
}

export interface TestimonialRecord {
  id: string; authorName: string; authorRoleFr?: string; authorRoleEn?: string; organizationName?: string
  quoteFr: string; quoteEn: string; rating: number; displayOrder: number; published: boolean
}

export interface PartnerRecord {
  id: string; name: string; logoUrl: string; websiteUrl?: string; displayOrder: number; published: boolean
}

export interface NewsletterRecord { id: string; email: string; active: boolean; createdAt: string }

export interface ActivityRecord {
  id: string; actorEmail: string; method: string; path: string; responseStatus: number; createdAt: string
}
