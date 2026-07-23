// Metodologia — revelação sequencial dos 4 Ps ([data-seq]): cada quadrante
// entra em cena um após o outro, amarrado ao progresso da rolagem (scrub).
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { $, reduced } from '../utils/dom.js';

export function metodoSeq() {
  const wrap = $('[data-seq]'); if (!wrap) return;
  const items = [...wrap.children]; if (!items.length) return;
  if (reduced) return;

  gsap.set(items, { opacity: 0, y: 44 });
  gsap.to(items, {
    opacity: 1, y: 0, ease: 'power2.out', duration: 0.8, stagger: 0.5,
    scrollTrigger: { trigger: wrap, start: 'top 80%', end: 'bottom 72%', scrub: 0.5 },
  });

  // Failsafe: nada pode ficar invisível para sempre.
  setTimeout(() => {
    const r = wrap.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) {
      items.forEach((el) => { if (parseFloat(getComputedStyle(el).opacity) < 0.05) gsap.set(el, { opacity: 1, y: 0 }); });
    }
  }, 4500);
}
