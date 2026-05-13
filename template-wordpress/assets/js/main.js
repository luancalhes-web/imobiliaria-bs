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
    // Pequeno delay para o usuário perceber a mudança
    setTimeout(() => sel.closest('form').submit(), 300);
  });
});
