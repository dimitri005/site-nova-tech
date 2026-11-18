import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const revealSelector = [
  '.inner-hero .public-shell',
  '.content-section .page-section-heading',
  '.content-section .content-card-grid > *',
  '.content-section .request-card',
  '.content-section .contact-aside',
  '.content-section .project-detail > *',
  '.content-section .course-detail > *',
  '.content-section .service-detail > *',
  '.admin-content > .admin-page-heading',
  '.admin-content > .admin-stat-grid > *',
  '.admin-content > .admin-panel',
  '.admin-content > .admin-edit-form',
].join(',')

export function usePageAnimations(scope: RefObject<HTMLElement | null>, routeKey: string) {
  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>(revealSelector).forEach((element, index) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 18 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          delay: Math.min(index % 4, 3) * 0.055,
          ease: 'power2.out',
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: { trigger: element, start: 'top 91%', once: true },
        })
      })
    }, scope)

    return () => media.revert()
  }, { scope, dependencies: [routeKey], revertOnUpdate: true })
}
