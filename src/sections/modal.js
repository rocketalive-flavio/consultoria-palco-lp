// Modal de aplicação — 2 passos: dados → confirmação. No envio, dispara o
// webhook com o payload do lead e o evento customizado "lead-palco" no pixel
// Meta (se configurado). Abre via [data-open-modal]; fecha por ×, backdrop, Esc.
import { lenisStop, lenisStart } from '../lib/lenis.js';
import { $, $$ } from '../utils/dom.js';

const WEBHOOK_URL = ''; // TODO: URL do webhook (Make/n8n/Zapier) que recebe o lead

export function aplicacaoModal() {
  const modal = $('[data-modal]'); if (!modal) return;
  const form = $('[data-modal-form]', modal);
  const s1 = $('[data-step="1"]', modal);
  const s2 = $('[data-step="2"]', modal);

  const open = (e) => {
    e.preventDefault();
    s1.hidden = false; s2.hidden = true;
    modal.hidden = false; document.body.classList.add('modal-on'); lenisStop();
    const first = $('input', form); if (first) first.focus();
  };
  const close = () => {
    modal.hidden = true; document.body.classList.remove('modal-on'); lenisStart();
  };

  $$('[data-open-modal]').forEach((el) => el.addEventListener('click', open));
  $$('[data-modal-close]', modal).forEach((el) => el.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('[data-send]', form);
    btn.disabled = true; btn.textContent = 'Enviando…';

    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      origem: 'lp-consultoria-palco',
      pagina: location.href,
      enviado_em: new Date().toISOString(),
    };

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (_) { /* não bloqueia a confirmação — lead segue registrado no pixel */ }

    if (typeof fbq === 'function') {
      fbq('trackCustom', 'lead-palco', {
        area: payload.area, tempo: payload.tempo,
        faturamento: payload.faturamento, investimento: payload.investimento,
      });
    }

    btn.disabled = false; btn.textContent = 'Enviar aplicação';
    s1.hidden = true; s2.hidden = false;
  });
}
