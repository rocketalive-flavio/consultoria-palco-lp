// Scroll-reactive effects: velocity marquee [data-mq] and word-paint statement
// [data-fill-sec]/[data-fill] (+ optional [data-fill-prog] counter).
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { $, reduced } from '../utils/dom.js';

export function marquee() {
  const t = $('[data-mq]'); if (!t) return;
  t.innerHTML += t.innerHTML;
  const loop = gsap.to(t, { xPercent: -50, repeat: -1, duration: 30, ease: 'none' });
  let lastY = window.scrollY;
  addEventListener('scroll', () => {
    const y = window.scrollY, v = y - lastY; lastY = y;
    gsap.to(loop, { timeScale: (v >= 0 ? 1 : -1) * (1 + Math.min(Math.abs(v) * 0.05, 4)), duration: 0.4, overwrite: true });
  }, { passive: true });
}

// Pin-free word paint as the statement travels through the viewport.
export function scrollFill() {
  const sec = $('[data-fill-sec]'); if (!sec) return;
  const el = $('[data-fill]', sec); if (!el) return;
  const words = [];
  const frag = document.createDocumentFragment();
  [...el.childNodes].forEach((node) => {
    const accent = node.nodeType === 1 && node.tagName === 'EM';
    node.textContent.split(/(\s+)/).forEach((tok) => {
      if (tok === '') return;
      if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
      const s = document.createElement('span'); s.className = 'w' + (accent ? ' accent' : ''); s.textContent = tok;
      frag.appendChild(s); words.push(s);
    });
  });
  el.textContent = ''; el.appendChild(frag);
  const prog = $('[data-fill-prog]', sec);
  if (reduced) { words.forEach((w) => w.classList.add('on')); return; }
  ScrollTrigger.create({
    trigger: sec, scrub: 0.6, start: 'top 78%', end: 'bottom 38%', invalidateOnRefresh: true,
    onUpdate: (self) => {
      const n = Math.round(self.progress * words.length * 1.08);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      if (prog) prog.textContent = String(Math.min(100, Math.round(self.progress * 100))).padStart(2, '0') + ' / 100';
    },
  });
}
