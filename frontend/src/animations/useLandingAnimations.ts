import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useLandingAnimations(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } })
      hero
        .from('.hero-copy .play-button', { autoAlpha: 0, scale: 0.7, duration: 0.55 })
        .from('.hero-copy .eyebrow', { autoAlpha: 0, y: 16, duration: 0.45 }, '-=0.25')
        .from('.hero-copy h1', { autoAlpha: 0, y: 28, duration: 0.7 }, '-=0.2')
        .from('.hero-copy > .button', { autoAlpha: 0, y: 14, duration: 0.45 }, '-=0.25')

      gsap.utils.toArray<HTMLElement>(
        '.feature-item, .about-visual, .about-copy, .service-card, .project-card, .stat, .mission-card, .mission-stat, .mission-benefit, .news-card, .news-promo, .why-visual, .why-copy, .contact-form, .vision-portrait, .vision-copy, .video-row, .success-copy, .footer-grid > *',
      ).forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })
    }, scope)

    return () => media.revert()
  }, { scope, dependencies: [] })
}
