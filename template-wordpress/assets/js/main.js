// ─── Menu mobile ─────────────────────────────────────────────────────────────
const toggle = document.getElementById('menu-toggle');
const nav    = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Fecha menu ao clicar em link
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ─── Galeria de fotos do imóvel ───────────────────────────────────────────────
const thumbs       = document.querySelectorAll('.galeria-thumb');
const imgPrincipal = document.getElementById('galeria-img-principal');

if (thumbs.length && imgPrincipal) {
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      imgPrincipal.src = thumb.dataset.src;
      thumbs.forEach(t => t.classList.remove('ativo'));
      thumb.classList.add('ativo');
    });
  });
}

// ─── Mapa: mostrar versão mobile abaixo de 900px ─────────────────────────────
const mapaMobile  = document.getElementById('mapa-mobile');
const mapaDesktop = document.getElementById('mapa-desktop');

function ajustaMapas() {
  if (!mapaMobile || !mapaDesktop) return;
  if (window.innerWidth <= 900) {
    mapaMobile.style.display  = 'block';
    mapaDesktop.style.display = 'none';
  } else {
    mapaMobile.style.display  = 'none';
    mapaDesktop.style.display = 'block';
  }
}
ajustaMapas();
window.addEventListener('resize', ajustaMapas);

// ─── Máscara simples de preço no buscador ────────────────────────────────────
document.querySelectorAll('.search-field input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    if (parseFloat(input.value) < 0) input.value = '';
  });
});

// ─── Submete filtros ao mudar qualquer select (UX) ───────────────────────────
document.querySelectorAll('#form-filtros select').forEach(sel => {
  sel.addEventListener('change', () => {
    setTimeout(() => sel.closest('form').submit(), 300);
  });
});

// ─── Busca AJAX na home (#form-busca → #imoveis-grid) ────────────────────────
const formBusca  = document.getElementById('form-busca');
const imoveisGrid = document.getElementById('imoveis-grid');

if (formBusca && imoveisGrid && typeof imobAjax !== 'undefined') {

  function renderCard(im) {
    const badge    = im.finalidade === 'aluguel' ? 'aluguel' : 'venda';
    const badgeTxt = badge.charAt(0).toUpperCase() + badge.slice(1);
    const quartos  = im.quartos ? `<span class="card-spec"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>${im.quartos} qts</span>` : '';
    const vagas    = im.vagas   ? `<span class="card-spec"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>${im.vagas} vaga${im.vagas > 1 ? 's' : ''}</span>` : '';
    const area     = im.area    ? `<span class="card-spec"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>${im.area} m²</span>` : '';
    const local    = [im.cidade, im.tipo].filter(Boolean).join(' · ');
    const preco    = im.preco   ? `<p class="card-preco">${im.preco_fmt}</p>` : '';

    return `<a href="${im.link}" class="card-imovel">
      <div class="card-thumb">
        <img src="${im.thumb}" alt="${im.titulo}" loading="lazy">
        <span class="card-badge ${badge}">${badgeTxt}</span>
      </div>
      <div class="card-body">
        ${preco}
        <h3 class="card-titulo">${im.titulo}</h3>
        <p class="card-local"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${local || '—'}</p>
        <div class="card-specs">${quartos}${vagas}${area}</div>
      </div>
    </a>`;
  }

  async function buscarImoveis(pagina = 1) {
    const data = new FormData(formBusca);
    data.append('action', 'imob_buscar');
    data.append('nonce',  imobAjax.nonce);
    data.append('pagina', pagina);

    imoveisGrid.style.opacity = '0.5';
    imoveisGrid.style.pointerEvents = 'none';

    try {
      const res  = await fetch(imobAjax.ajaxurl, { method: 'POST', body: data });
      const json = await res.json();

      if (!json.success) throw new Error('Resposta inválida');

      const { imoveis, total, max_pagina } = json.data;

      if (imoveis.length === 0) {
        imoveisGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--texto-suave);padding:3rem 0">Nenhum imóvel encontrado.</p>';
      } else {
        imoveisGrid.innerHTML = imoveis.map(renderCard).join('');
      }

      // Paginação dinâmica
      let paginacao = document.getElementById('busca-paginacao');
      if (!paginacao) {
        paginacao = document.createElement('div');
        paginacao.id = 'busca-paginacao';
        paginacao.className = 'paginacao';
        imoveisGrid.after(paginacao);
      }
      if (max_pagina > 1) {
        paginacao.innerHTML = Array.from({ length: max_pagina }, (_, i) => {
          const p = i + 1;
          return `<button class="${p === pagina ? 'ativo' : ''}" data-pagina="${p}">${p}</button>`;
        }).join('');
        paginacao.querySelectorAll('button').forEach(btn =>
          btn.addEventListener('click', () => buscarImoveis(parseInt(btn.dataset.pagina)))
        );
      } else {
        paginacao.innerHTML = '';
      }

    } catch {
      imoveisGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--texto-suave);padding:3rem 0">Erro ao carregar imóveis. Tente novamente.</p>';
    } finally {
      imoveisGrid.style.opacity = '';
      imoveisGrid.style.pointerEvents = '';
    }
  }

  formBusca.addEventListener('submit', e => {
    e.preventDefault();
    buscarImoveis(1);
  });
}
