# CLAUDE.md

Este arquivo é a memória compartilhada do projeto: vale tanto para o Claude Code no PC (`C:\Users\luanc\imobiliaria-bs`) quanto para as sessões na web (claude.ai/code). Atualize aqui o que precisa ser lembrado entre sessões, e faça commit + push.

## Repositório

- GitHub: https://github.com/luancalhes-web/imobiliaria-bs (branch principal: `master`)
- Clone local oficial: `C:\Users\luanc\imobiliaria-bs`
- Antes de trabalhar no PC: `git pull origin master`. Depois: commit + `git push`.
- Clone antigo (obsoleto, não usar): `C:\Users\luanc\OneDrive\Área de Trabalho\Claude Code Test\projeto-imob`. As alterações dele foram migradas no branch `migracao-local`.

| Pasta / branch | O que é |
|---|---|
| `template-wordpress/` | Tema WordPress **Imobiliária BS** (detalhes abaixo) |
| `instalar-tema.ps1` | Copia o tema para o site `imobiliaria-demo` do Local by WP Engine |
| `scripts/import-imoveis.csv` | Imóveis de exemplo para importar |
| `assessores/` | Assessores de IA no WhatsApp (Next.js na Vercel). Fase 0: webhook + Diretor (Haiku 5.5). Ver `assessores/README.md` |
| `plano-assessores/PLANO.md` | Plano completo dos assessores (cópia do meuassessor.com) |
| `placas-nfc/` | Negócio de placas NFC de avaliação (Baixada Santista): painel, preços, scripts de WhatsApp. Ver `placas-nfc/README.md` |
| branch `claude/personal-finance-agent-y5h3xs` | `finance-agent/`: bot financeiro "Tio Patinhas" no Telegram (Prisma, Docker, Render) |

---

## Tema WordPress Imobiliária BS

Tema para imobiliárias da Baixada Santista (litoral de SP). Arquivos PHP, CSS e JS puros, sem build.

**Autor:** Litoral Digital (`litoraldigital.com.br`) · **Text Domain:** `imobiliaria-bs`

### Instalação

1. Crie o site `imobiliaria-demo` no Local by WP Engine (já existe em `C:\Users\luanc\Local Sites\imobiliaria-demo`).
2. Rode `.\instalar-tema.ps1` na raiz do repositório. Ele apaga e recopia `wp-content/themes/imobiliaria-bs/`.
3. Ative o tema em Aparência > Temas e configure em Aparência > Imobiliária.

Edite sempre no repositório e reinstale com o script. Não edite direto na pasta do Local, porque a próxima instalação sobrescreve.

### Custom Post Type: `imovel`

Meta registrada via `register_post_meta` (sem ACF):

| Meta key | Tipo | Uso |
|---|---|---|
| `_imovel_codigo` | string | Código do anúncio |
| `_imovel_preco` | number | Preço em R$ |
| `_imovel_area` | number | Área em m² |
| `_imovel_quartos` | integer | Quartos |
| `_imovel_banheiros` | integer | Banheiros |
| `_imovel_vagas` | integer | Vagas |
| `_imovel_endereco` | string | Endereço completo |
| `_imovel_maps_url` | string | `src` do iframe do Google Maps |
| `_imovel_whatsapp` | string | WhatsApp do corretor (só dígitos) |
| `_imovel_finalidade` | string | `venda` ou `aluguel` |
| `_imovel_gallery` | string | IDs de anexos separados por vírgula |

### Taxonomias

- `tipo_imovel` (slug `tipo`), hierárquica: Apartamento, Casa, Terreno…
- `cidade_imovel` (slug `cidade`), hierárquica: cidades atendidas

### Opções do tema (Aparência > Imobiliária)

`imob_telefone`, `imob_whatsapp`, `imob_cidade`, `imob_endereco`, `imob_creci`, `imob_instagram`, `imob_facebook`, `imob_maps_embed`

### Templates

| Arquivo | Papel |
|---|---|
| `header.php` / `footer.php` | Cabeçalho fixo com menu mobile; rodapé |
| `page-home.php` | Home (Página > Template: Home): hero com busca, destaques, diferenciais, CTA |
| `archive-imovel.php` | Listagem com filtros GET (`#form-filtros`) |
| `single-imovel.php` | Página do imóvel: galeria + detalhes / card de contato + mapa |
| `index.php` | Fallback |

### Busca AJAX (`imob_buscar`)

`wp_ajax_imob_buscar` / `wp_ajax_nopriv_imob_buscar` em `functions.php`. POST: `tipo`, `cidade`, `preco_max`, `pagina`, `nonce` (`imob_nonce`). Retorna `imoveis[]` (com `preco_fmt`, `finalidade`, `area`, `quartos`, `vagas`, `cidade`, `tipo`), `total` e `max_pagina`. O `assets/js/main.js` envia `#form-busca` e monta os cards em `#imoveis-grid`, com paginação.

### SEO

- `imob_schema_local_business()`: JSON-LD `RealEstateAgent` na home
- `single-imovel.php`: JSON-LD `RealEstateListing`

### Design

Variáveis em `assets/css/main.css`: `--azul` `#1a3a5c`, `--azul-claro` `#2563eb`, `--laranja` `#f97316`. Fonte Inter. Breakpoints 900px e 600px.

### Convenções

- Funções PHP com prefixo `imob_`.
- WhatsApp só com dígitos: `preg_replace('/\D/', '', $numero)` antes de montar links `wa.me`.
- Preço: `imob_formata_preco($valor)` (gera `R$ 1.234.567`).
- Nonce do meta box: ação `imob_save_meta`, campo `imob_meta_nonce`.
- `assets/images/placeholder.jpg` está versionado (imagem para imóveis sem foto).

### Plano e progresso (atualize os checkboxes)

**Fase 1: Instalação**
- [x] Criar arquivos do tema (PHP, CSS, JS)
- [x] Script `instalar-tema.ps1`
- [x] Instalar e ativar o tema no WordPress
- [x] Criar a página Home com o template "Home"

**Fase 2: Dados da imobiliária ← VOCÊ ESTÁ AQUI** (Aparência > Imobiliária)
- [ ] Telefone
- [ ] WhatsApp (só números, com DDD, ex.: 13999990000)
- [ ] Cidade principal (ex.: Santos)
- [ ] Endereço completo
- [ ] CRECI
- [ ] Instagram (URL completa)
- [ ] Facebook (URL completa)
- [ ] Google Maps embed (Google Maps > Compartilhar > Incorporar mapa > copiar só o `src`)

**Fase 3: Imóveis e taxonomias**
- [ ] Tipos: Apartamento, Casa, Terreno, Cobertura…
- [ ] Cidades: Santos, Guarujá, Praia Grande, Bertioga…
- [ ] Primeiros imóveis: título, fotos, preço, área, quartos, vagas, endereço, WhatsApp do corretor, finalidade
- [x] `assets/images/placeholder.jpg`

**Fase 4: Testes finais**
- [ ] Busca AJAX na home e filtro GET no arquivo
- [ ] Layout mobile (< 900px e < 600px)
- [ ] Links de WhatsApp nos cards e no CTA
- [ ] Schema JSON-LD (search.google.com/test/rich-results)
- [ ] Página do imóvel (galeria, mapa, botão WhatsApp)

### Histórico

- 2026-05-13/14: `main.js` com menu mobile, galeria, mapa responsivo, busca AJAX e auto-submit dos filtros. Corrigido em `functions.php`: `area` lia `_imovel_quartos`; adicionados `preco_fmt` e `finalidade` na resposta AJAX. Essas alterações ficaram sem commit no clone antigo até 2026-10-22 (branch `migracao-local`).
