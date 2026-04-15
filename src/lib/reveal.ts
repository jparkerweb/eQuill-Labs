import { animate } from 'motion';

export function initReveal() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        animate(
          el,
          { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
          { duration: 0.5, ease: 'easeOut' },
        );
        observer.unobserve(el);
      }
    },
    { threshold: 0.15 },
  );

  for (const el of targets) {
    el.style.opacity = '0';
    observer.observe(el);
  }
}
