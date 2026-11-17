// ============================================================================
// VÍDEOS DA PÁGINA — edite aqui e dê F5.
// ============================================================================
// Cada item:
//   video  : caminho do mp4
//   poster : imagem de capa
//   label  : legenda (só nas etapas do plano)
//   pos    : ponto focal do recorte, no formato 'X% Y%' (object-position).
//   zoom   : aproximação (1 = sem zoom).
//   ratio  : proporção da caixa, responsiva. Ex.: '16 / 9'.
//
// Para reposicionar com botões: abra a página com ?edit.
//   http://localhost:4500/?edit
//
// Disponíveis em assets/video/:
//   pele.mp4 · harmonizacao.mp4 · laser.mp4 · protocolo.mp4
//   recepcao.mp4 · produtos.mp4 · marcacoes.mp4
// ============================================================================
window.VIDEOS = {
  frentes: [
    { video: 'assets/video/pele.mp4',         poster: 'assets/video/pele.jpg',         pos: '56% 82%', zoom: 1, ratio: '367 / 346' },
    { video: 'assets/video/harmonizacao.mp4', poster: 'assets/video/harmonizacao.jpg', pos: '66% 40%', zoom: 1, ratio: '367 / 346' },
    { video: 'assets/video/laser.mp4',        poster: 'assets/video/laser.jpg',        pos: '42% 84%', zoom: 1, ratio: '367 / 346' },
    { video: 'assets/video/protocolo.mp4',    poster: 'assets/video/protocolo.jpg',    pos: '50% 50%', zoom: 1, ratio: '367 / 346' }
  ],

  // Etapas do plano em "O cuidado". Troque os vídeos quando tiver os cortes.
  metodo: [
    { video: 'assets/video/recepcao.mp4',  poster: 'assets/video/recepcao.jpg',  label: 'Avaliação',           pos: '50% 40%', zoom: 1, ratio: '16 / 9' },
    { video: 'assets/video/plano.mp4',     poster: 'assets/video/plano.jpg',     label: 'Plano individual',    pos: '50% 35%', zoom: 1, ratio: '16 / 9' },
    { video: 'assets/video/marcacoes.mp4', poster: 'assets/video/marcacoes.jpg', label: 'Sessões acompanhadas', pos: '42% 28%', zoom: 1, ratio: '16 / 9' },
    { video: 'assets/video/pele.mp4',      poster: 'assets/video/pele.jpg',      label: 'Manutenção',          pos: '56% 82%', zoom: 1, ratio: '16 / 9' }
  ]
};
