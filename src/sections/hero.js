// Hero intro — plays once the preloader releases. Keep it short: the statement
// lines rise, the bottom bar fades in. Replace/extend per project (this is the
// natural home for the site's signature moment — 3D piece, canvas, etc.).
import { gsap } from '../lib/gsap.js';
import { $, $$, reduced } from '../utils/dom.js';

export function heroIntro() {
  const hero = $('[data-hero]'); if (!hero || reduced) return;
  const lines = $$('[data-hero-line]', hero);
  const bar = $('[data-hero-bar]', hero);
  const tl = gsap.timeline();
  if (lines.length) tl.fromTo(lines, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' });
  if (bar) tl.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.4');
}
