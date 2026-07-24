// CTAs de aplicação ([data-cta]) — abrem o Google Forms em nova aba (HTML) e
// registram o evento "lead-palco" no pixel Meta no clique, quando configurado.
import { $$ } from '../utils/dom.js';

export function ctaTracking() {
  $$('[data-cta]').forEach((el) => el.addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('trackCustom', 'lead-palco', { acao: 'clique-cta' });
  }));
}
