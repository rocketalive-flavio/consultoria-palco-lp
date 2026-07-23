// Preloader — counts to 100, wipes up, then releases scroll. Resolves a Promise
// so main.js can boot content motion only after it finishes. 3.5s hard failsafe.
import { gsap } from '../lib/gsap.js';
import { lenisStop, lenisStart } from '../lib/lenis.js';
import { $, reduced } from '../utils/dom.js';

export function preloader() {
  const pl = $('[data-pl]');
  if (!pl || reduced) { if (pl) pl.style.display = 'none'; lenisStart(); return Promise.resolve(); }
  lenisStop();
  const w = $('[data-pl-w]'), bar = $('[data-pl-bar]'), c = $('[data-pl-c]');
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (done) return; done = true; pl.style.pointerEvents = 'none'; pl.style.transform = 'translateY(-100%)'; lenisStart(); resolve(); };
    const cnt = { v: 0 };
    gsap.set(w, { yPercent: 115 });
    gsap.timeline({ onComplete: finish })
      .to(w, { yPercent: 0, duration: 0.8, ease: 'power3.out' })
      .to(bar, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.3')
      .to(cnt, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { if (c) c.textContent = Math.round(cnt.v); } }, '<')
      .to([w, c], { opacity: 0, duration: 0.4 }, '+=0.05')
      .to(pl, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1');
    setTimeout(finish, 3500);
  });
}
