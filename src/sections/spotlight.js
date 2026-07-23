// Efeito assinatura — "as luzes acendem": o palco do hero ([data-spot]) sai do
// breu para a luz quando o preloader libera, como a iluminação de cena subindo.
// Parallax sutil de mouse em desktop completa a profundidade.
import { gsap } from '../lib/gsap.js';
import { $, reduced, fine } from '../utils/dom.js';

export function spotlight() {
  const stage = $('[data-spot] img');   // só a foto: os véus de degradê ficam estáticos
  if (!stage) return;
  if (reduced) return;

  // Termina em 1.03 para dar folga ao parallax de mouse sem expor bordas.
  gsap.fromTo(stage,
    { filter: 'brightness(0.12)', scale: 1.08 },
    { filter: 'brightness(1)', scale: 1.03, duration: 2.2, ease: 'power2.out' });

  if (!fine) return;
  const xTo = gsap.quickTo(stage, 'x', { duration: 1.2, ease: 'power3' });
  addEventListener('mousemove', (e) => {
    const nx = e.clientX / innerWidth - 0.5;        // -0.5 → 0.5
    xTo(nx * innerWidth * 0.015);                   // desloca no máx. ~1.5vw
  }, { passive: true });
}
