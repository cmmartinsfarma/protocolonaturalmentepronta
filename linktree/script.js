// Usa CONFIG de config.js (carregado antes deste script)
// Se CONFIG não estiver definido, usa fallback silencioso para exibir dados mockados
const PROXY_URL = typeof CONFIG !== 'undefined' ? CONFIG.PROXY_URL : '';
const SPREADSHEET_ID = typeof CONFIG !== 'undefined' ? CONFIG.SHEET_ID : '';
const SHEET_NAME = typeof CONFIG !== 'undefined' ? CONFIG.SHEET_LINKS : 'Sheet1';
const SHEET_CONFIG = typeof CONFIG !== 'undefined' ? CONFIG.SHEET_CONFIG : 'Sheet2';
const RANGE = typeof CONFIG !== 'undefined' ? CONFIG.RANGE_LINKS : 'Sheet1!A:F';
const RANGE_CONFIG = typeof CONFIG !== 'undefined' ? CONFIG.RANGE_CONFIG : 'Sheet2!A:B';

// ============================================================
// DADOS MOCKADOS — usados enquanto a planilha não for configurada
// Remova ou deixe vazio após configurar SHEET_ID no config.js
// ============================================================
const MOCK_DATA = [
  // [categoria, ordem_cat, subcategoria, ordem_subcat, nome_link, url]
  ['Atendimento', '1', '', '', 'Agendar avaliação gratuita', 'https://wa.me/5516992133717?text=Ol%C3%A1%2C%20Dra.%20Carolina%21%20Vim%20pelo%20link%20e%20gostaria%20de%20agendar%20minha%20avalia%C3%A7%C3%A3o%20%E2%9C%A8'],
  ['Atendimento', '1', '', '', 'Site oficial', 'https://www.naturalmentepronta.com.br/'],
];

// ============================================================
// FUNÇÕES PRINCIPAIS
// ============================================================

/**
 * Busca os dados da planilha via proxy.
 * Espera um JSON no formato { values: [[...], [...]] }.
 */
async function fetchSheet(range) {
  const r = await fetch(`${PROXY_URL}?range=${encodeURIComponent(range)}`);
  if (!r.ok) throw new Error(`Erro ao buscar planilha: ${r.status} ${r.statusText}`);
  return r.json();
}

/**
 * Busca as configurações visuais da Sheet2.
 * Espera linhas no formato: [ chave, valor ]
 * Chaves esperadas: nome, descricao, handle, instagram, whatsapp,
 * logo, subtitulo, cor_fundo, slide1..slideN
 */
async function fetchConfig() {
  try {
    const data = await fetchSheet(RANGE_CONFIG);
    const rows = data.values || [];

    const config = {};
    rows.forEach(row => {
      const chave = (row[0] || '').trim().toLowerCase();
      const valor = (row[1] || '').trim();
      if (chave && chave !== 'chave') config[chave] = valor;
    });
    return config;
  } catch (e) {
    console.warn('Não foi possível carregar configurações da Sheet2:', e);
    return {};
  }
}

/**
 * Converte um link de compartilhamento do Google Drive para URL direta de imagem.
 */
function converterUrlDrive(url) {
  if (!url) return url;

  const matchFile = url.match(/\/file\/d\/([^/?#]+)/);
  if (matchFile) {
    return `https://lh3.googleusercontent.com/d/${matchFile[1]}`;
  }

  const matchId = url.match(/[?&]id=([^&]+)/);
  if (matchId && url.includes('drive.google.com')) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return url;
}

/**
 * Aplica as configurações visuais no DOM.
 */
function applyConfig(config) {
  // Nome da organização — title + alt da logo
  if (config.nome) {
    document.title = config.nome;
    const logoEl = document.getElementById('logo-img');
    if (logoEl) logoEl.alt = config.nome;
  }

  // Meta description
  if (config.descricao) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', config.descricao);
  }

  // Handle (@usuario) — oculta se vazio
  const handleEl = document.getElementById('handle');
  if (handleEl) {
    if (config.handle) {
      handleEl.textContent = '@' + config.handle.replace(/^@/, '');
    } else {
      handleEl.style.display = 'none';
    }
  }

  // Subtítulo (ex.: "Farmacêutica Esteta · CRF 125.459") — oculta se vazio
  const subtitleEl = document.getElementById('logo-subtitle');
  if (subtitleEl) {
    if (config.subtitulo) {
      subtitleEl.textContent = config.subtitulo;
    } else if (config.subtitulo === '') {
      subtitleEl.style.display = 'none';
    }
  }

  // Instagram — só exibe se tiver URL
  const igEl = document.getElementById('link-instagram');
  if (igEl && config.instagram) {
    igEl.href = config.instagram;
    igEl.style.display = 'flex';
  }

  // WhatsApp — só exibe se tiver URL
  const waEl = document.getElementById('link-whatsapp');
  if (waEl && config.whatsapp) {
    waEl.href = config.whatsapp;
    waEl.style.display = 'flex';
  }

  // Logo — converte link do Drive automaticamente se necessário
  const logoImgEl = document.getElementById('logo-img');
  if (logoImgEl && config.logo) {
    logoImgEl.src = converterUrlDrive(config.logo);
  }

  // Slider — coleta campos slide1, slide2, ... slideN
  const slides = [];
  let i = 1;
  while (config[`slide${i}`]) {
    slides.push(converterUrlDrive(config[`slide${i}`]));
    i++;
  }
  if (slides.length > 0) buildSlider(slides);

  // Cor de fundo — degradê da cor customizada ao creme
  if (config.cor_fundo) {
    document.body.style.background = `linear-gradient(180deg, ${config.cor_fundo} 0%, var(--cream) 60%)`;
    document.body.style.backgroundAttachment = 'fixed';
  }
}

/**
 * Busca dados da planilha via proxy.
 * Se SHEET_ID não foi configurado, usa MOCK_DATA.
 */
async function fetchLinks() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'COLE_O_ID_DA_PLANILHA_AQUI') {
    console.info('Usando dados mockados. Configure SHEET_ID no config.js.');
    return MOCK_DATA;
  }

  const data = await fetchSheet(RANGE);
  const rows = data.values || [];

  if (rows.length > 0 && isNaN(rows[0][1])) {
    rows.shift();
  }

  return rows;
}

/**
 * Agrupa as linhas em estrutura: { categoria: { subcategoria: [links] } }
 */
function agruparDados(rows) {
  const categorias = {};

  rows.forEach(row => {
    const categoria = (row[0] || '').trim();
    const ordemCat = parseInt(row[1]) || 99;
    const subcategoria = (row[2] || '').trim();
    const ordemSubcat = parseInt(row[3]) || 99;
    const nomeLink = (row[4] || '').trim();
    const url = (row[5] || '').trim();

    if (!categoria) return;

    if (!categorias[categoria]) {
      categorias[categoria] = { ordem: ordemCat, subcategorias: {} };
    }

    const chaveSubcat = subcategoria || '__sem_subcategoria__';

    if (!categorias[categoria].subcategorias[chaveSubcat]) {
      categorias[categoria].subcategorias[chaveSubcat] = { ordem: ordemSubcat, links: [] };
    }

    if (nomeLink && url) {
      categorias[categoria].subcategorias[chaveSubcat].links.push({ nome: nomeLink, url });
    }
  });

  return categorias;
}

/**
 * Gera o HTML dos acordeões e injeta no DOM.
 */
function buildAccordions(categorias) {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  const catOrdenadas = Object.entries(categorias)
    .sort(([, a], [, b]) => a.ordem - b.ordem);

  catOrdenadas.forEach(([nomeCategoria, dadosCat]) => {
    const li = document.createElement('li');
    li.className = 'lista';

    const botao = document.createElement('button');
    botao.className = 'accordion';
    botao.innerHTML = `<big><b>${nomeCategoria}</b></big>`;

    const painel = document.createElement('div');
    painel.className = 'panel';

    const subcatsOrdenadas = Object.entries(dadosCat.subcategorias)
      .sort(([, a], [, b]) => a.ordem - b.ordem);

    subcatsOrdenadas.forEach(([chave, dadosSubcat]) => {
      if (chave === '__sem_subcategoria__') {
        dadosSubcat.links.forEach(link => {
          const a = document.createElement('a');
          a.className = 'linksgerais';
          a.href = link.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = link.nome;
          painel.appendChild(a);
        });
      } else {
        const botaoInner = document.createElement('button');
        botaoInner.className = 'accordion-inner';
        botaoInner.textContent = chave;

        const painelInner = document.createElement('div');
        painelInner.className = 'panel-inner';

        dadosSubcat.links.forEach(link => {
          const a = document.createElement('a');
          a.className = 'linksgerais';
          a.href = link.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = link.nome;
          painelInner.appendChild(a);
        });

        botaoInner.addEventListener('click', function () {
          this.classList.toggle('active');
          painelInner.style.display = painelInner.style.display === 'block' ? 'none' : 'block';
        });

        painel.appendChild(botaoInner);
        painel.appendChild(painelInner);
      }
    });

    botao.addEventListener('click', function () {
      this.classList.toggle('active');
      painel.style.display = painel.style.display === 'block' ? 'none' : 'block';
    });

    li.appendChild(botao);
    li.appendChild(painel);
    lista.appendChild(li);
  });
}

/**
 * Inicializa o carregamento da página.
 */
async function init() {
  const loading = document.getElementById('loading');
  const erro = document.getElementById('erro');

  const [config, rows] = await Promise.allSettled([
    fetchConfig(),
    fetchLinks()
  ]);

  if (config.status === 'fulfilled') {
    applyConfig(config.value);
  }

  try {
    const linhas = rows.status === 'fulfilled' ? rows.value : (() => { throw rows.reason; })();
    const categorias = agruparDados(linhas);
    buildAccordions(categorias);
    loading.style.display = 'none';
  } catch (e) {
    console.error(e);
    loading.style.display = 'none';
    erro.style.display = 'block';
  }
}

init();

// ============================================================
// SLIDER DE IMAGENS
// ============================================================

let sliderIndex = 0;

function buildSlider(urls) {
  const container = document.getElementById('slider-container');
  const slider = document.getElementById('slider');
  slider.innerHTML = '';

  urls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Imagem do slider';
    img.draggable = false;
    img.addEventListener('click', () => openModal(img));
    slider.appendChild(img);
  });

  sliderIndex = 0;
  _updateSlider();
  container.style.display = 'block';

  if (urls.length <= 1) {
    document.querySelector('.slider-prev').style.display = 'none';
    document.querySelector('.slider-next').style.display = 'none';
  }
}

function _updateSlider() {
  const slider = document.getElementById('slider');
  if (!slider) return;
  slider.style.transform = `translateX(${-sliderIndex * 100}%)`;
}

function showSlide(n) {
  const total = document.querySelectorAll('#slider img').length;
  if (total === 0) return;
  sliderIndex = (n + total) % total;
  _updateSlider();
}

function nextSlide() { showSlide(sliderIndex + 1); }
function prevSlide() { showSlide(sliderIndex - 1); }

function openModal(img) {
  document.getElementById('modalImage').src = img.src;
  const modal = document.getElementById('imageModal');
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('imageModal').style.display = 'none';
}
