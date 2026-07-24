// PALCO — entry point. Wires the scroll system (Lenis) + motion (GSAP), then
// boots each section module. Boot order is intentional: scroll → chrome →
// content/motion (sem preloader — a página abre direto no palco).
import { initLenis } from './lib/lenis.js';
import { ScrollTrigger } from './lib/gsap.js';
import { cursor, magnetic } from './animations/interaction.js';
import { reveals, frameParallax, sectionReveal } from './animations/reveals.js';
import { marquee, scrollFill } from './animations/scroll-fx.js';
import { heroIntro } from './sections/hero.js';
import { spotlight } from './sections/spotlight.js';
import { metodoSeq } from './sections/metodo.js';
import { ctaTracking } from './sections/cta.js';

async function boot() {
  initLenis();
  cursor();
  magnetic();
  ctaTracking();
  spotlight();
  heroIntro();
  await reveals();
  marquee();
  scrollFill();
  frameParallax();
  sectionReveal();
  metodoSeq();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
