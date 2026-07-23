// Scroll reveals: [data-fade] fade-up, [data-words] SplitText line-mask,
// [data-wipe] clip-path wipe and [data-plx] in-frame photo parallax.
// Generic on purpose — everything binds via data-attributes, never content classes.
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap.js';
import { $$, reduced, fine } from '../utils/dom.js';

export async function reveals() {
  await document.fonts.ready;
  const fades = $$('[data-fade]');
  gsap.set(fades, { opacity: 0, y: 22 });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    gsap.to(e.target, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }); io.unobserve(e.target);
  }), { threshold: 0.12 });
  fades.forEach((el) => io.observe(el));

  const splits = [];
  $$('[data-words]').forEach((el) => {
    const s = new SplitText(el, { type: 'lines', mask: 'lines' });
    gsap.set(s.lines, { yPercent: 110 });
    const rec = { el, s, played: false };
    const play = () => { if (rec.played) return; rec.played = true; gsap.to(s.lines, { yPercent: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1 }); };
    splits.push(rec);
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
  });
  // Failsafe: nothing may stay invisible forever (fonts/CDN hiccups included).
  setTimeout(() => {
    const inV = (el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
    splits.forEach((r) => { if (!r.played && inV(r.el)) { r.played = true; gsap.set(r.s.lines, { yPercent: 0 }); } });
    $$('[data-fade]').forEach((el) => { if (inV(el) && parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = '1'; el.style.transform = 'none'; } });
  }, 4500);
}

// Parallax inside framed photos: mark the <img> parent frame with [data-plx].
export function frameParallax() {
  if (reduced || !fine) return;
  $$('[data-plx] img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

// Signature wipe-reveal (clip-path) on [data-wipe] blocks.
export function sectionReveal() {
  if (reduced || !fine) return;
  $$('[data-wipe]').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;  // visible at load → leave alone
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, { clipPath: 'inset(0 0 0% 0)', ease: 'power3.out', duration: 1.1,
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });
}
