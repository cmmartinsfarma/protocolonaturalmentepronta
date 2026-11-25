# Quebra-Nozes 2026 — página do chaveiro NFC

Primeira versão da página que abre quando o chaveiro é aproximado do celular.

## Prévia

A página é publicada em `linktree/site/q/` (projeto Vercel `dracarolinamartins`).
Para pré-visualizar, sirva a pasta `linktree/site`:

```powershell
cd linktree/site
python -m http.server 4173
```

Abra `http://localhost:4173/q/`.

## O que editar

Tudo o que muda com frequência está no bloco `CONFIG`, no fim de `index.html`:

```js
const CONFIG = {
  desconto: "10%",
  validade: "31 de janeiro de 2027",
  validadeCurta: "31/01/2027",
  whatsapp: "5516992133717",
  eventoFim: "2026-12-13T00:00:00-03:00"
};
```

- Trocar `10%` por `20%` atualiza a página e a mensagem do WhatsApp.
- A data de `eventoFim` ativa o estado pós-evento ("Obrigada por essa noite").
- A oferta é apresentada como um presente da Dra. Carolina Martins; o cupom detalha a validade e a apresentação do chaveiro.

## Identidade visual

A página segue o cartaz do evento: azul-meia-noite, veludo bordô, dourado e papel pergaminho (marfim quente, sem o rosado anterior), com serifa clássica, molduras finas e o título "O Quebra-Nozes" no cabeçalho.

## Placeholders para completar

- **Logo da escola:** já incluído em `assets/liberte-dance-studio.png`, com fundo transparente e recorte. Aparece em destaque no cartão do finale.
- **Teatro:** o cartaz atualizado informa **Teatro Pedro II · Ribeirão Preto**. O endereço completo ainda não foi informado.
- **Fotos:** não haverá galeria pós-apresentação. O finale traz o crédito da escola, sem imagens do espetáculo.
- **Mensagem da Dra.:** a seção biográfica foi removida para enxugar a página. Há espaço para um vídeo curto no hero (boas-vindas + oferta), com o retrato atual como capa; falta definir o roteiro e receber o arquivo.
- **Oferta:** validar o percentual e as regras com a clínica.

A página está com `noindex,follow`. Se quiser que ela apareça no Google, remova essa meta no `<head>`.

## Atalhos pessoais

A seção **Seus atalhos** é funcional e local:

- Adicionar, editar e excluir links.
- Instruções curtas de uso no topo da seção e sugestões iniciais de WhatsApp, Instagram, site e ligação.
- Compartilhar a página e instalar como app.
- Dados em `localStorage`, chave `qn:atalhos:v1`. Nada vai para servidor.
- Exportar backup em `meus-atalhos-quebra-nozes.json` e importar em outro aparelho; os botões aparecem depois do primeiro atalho salvo.
- Para zerar: limpar os dados do site no navegador ou rodar `localStorage.removeItem("qn:atalhos:v1")` no console.

O avatar é gerado pela inicial do título, sem chamada a serviço de favicon.

## Modo app (PWA)

- A PWA instalada abre em `?app=1`, direto em **“Seus atalhos”**.
- O link **“Ver a lembrança”** abre `?full=1`, a página completa do evento.
- Na página completa instalada, aparece **“Meus atalhos”** no cabeçalho para voltar.
- `manifest.shortcuts` (Android, long-press do ícone): **Meus atalhos**, **Ver o presente**, **Realização**.
- O modo app esconde hero, programa, oferta e finale; mostra atalhos, a faixa de 10% e o rodapé.
- A navegação normal em `/q/` continua sendo a página completa do evento.

## Abertura de cortina

A primeira visita da sessão abre com uma cortina de veludo bordô e o título do festival em dourado. A cortina se abre sozinha em ~1,8s (ou com um toque), e o hero entra logo depois.

- aparece uma vez por sessão (`sessionStorage["qn:overture"] = "v1"`);
- nunca aparece no modo app (`?app=1`);
- desligada com `prefers-reduced-motion`;
- `?overture=1` força a abertura e `?overture=0` desliga, para testar;
- roda num script próprio, logo após a cortina, para não depender do restante do JavaScript.

## Snow Fall (Originkit)

O site recebe o componente **Snow Fall** da Originkit, um canvas de neve com o preset devolvido pelo MCP.

- fonte original em `originkit/snowfall.tsx` (sem alterações); a página usa a variante `originkit/snowfall-flakes.tsx`, derivada dela, que desenha flocos de 6 braços em vez de pontos e adiciona rotação;
- camada fixa em todo o site, em dourado `#D2AE6C`, porque o branco desapareceria no pergaminho;
- 360 flocos no desktop e 180 no celular, tamanho 2–4,5 e opacidade 20–60%; bundle em `assets/snowfall.js`, carregado depois que a página fica ociosa;
- não roda no modo app nem com `prefers-reduced-motion`;
- detalhes de build e atribuição em `originkit/README.md`.

A faixa de programa ficou só com data e sessões; o rótulo “Programa de sala” e os marcadores de ato saíram.

## Retrato

O hero usa o retrato original em `assets/carolina.webp`, sem tratamento de cor. Os acentos da página (títulos, CTA e selo) usam o bordô profundo do evento, em vez do rosé anterior; o selo de 10% tem fio dourado e fica no arco.

## Mascote

O mascote usa o Quebra-Nozes fotorrealista em `assets/nutcracker-ultra.webp`, gerado a partir da descrição do personagem e recortado com fundo transparente. `assets/nutcracker.svg` fica como versão vetorial de reserva.

- mensagem e inclinação mudam por seção (boas-vindas, oferta, atalhos, finale);
- no desktop, a mensagem aparece como uma nota de papel ao lado do boneco;
- em telas até 1200px ele aparece por ~3,6s a cada seção e some; no celular fica só o boneco, sem balão, para não cobrir o texto;
- respeita `prefers-reduced-motion` e fica oculto para leitores de tela (`aria-hidden`).

## Mobile

O mobile é a superfície principal (toque NFC). A página prioriza:

- Um único CTA no hero, “Ver o presente”; o agendamento fica no cupom e no sticky.
- Instalação como app pelos atalhos (e pelo diálogo do navegador).
- Data e sessões na faixa de programa, logo abaixo.
- Faixa de programa em duas colunas.
- Alvos de toque de 44px nos atalhos, sugestões, diálogo e links secundários.
- Sticky de agendamento acessível e com `safe-area`.
- Retrato reduzido para encurtar o primeiro scroll.
- Fluxo enxuto: oferta → atalhos → finale → rodapé. "O cuidado" e o card "Guarde esta página" foram removidos; a instalação fica no hero.

## Chaveiro

- **URL de produção:** `https://dracarolinamartins.vercel.app/q`
- **URL para gravar nas 200 tags:** `https://dracarolinamartins.vercel.app/q` (39 caracteres)
- Funciona com ou sem barra no final; o `<base href="/q/">` resolve os assets nos dois casos.
- Uma URL para todas as tags; não precisa de slug por unidade.
- Grave com NFC Tools depois que o domínio estiver no ar.
- Teste 3 tags em iPhone e Android antes de gravar o lote.

## Deploy

A página é estática e funciona em qualquer host. Em Vercel, o diretório `q/` vira `/q/`.
O `<base href="/q/">` faz `/q` e `/q/` funcionarem igual; não precisa mexer em `trailingSlash`.

O PWA (instalar na tela inicial) exige HTTPS. Em `localhost` o service worker também funciona.

## Analytics

O script da Vercel Analytics está incluído (`/_vercel/insights/script.js`).
Eventos: `cta_coupon`, `cta_sticky`, `cta_footer`, `add_home_shortcuts`, `share_page`,
`shortcut_add`, `shortcut_edit`, `shortcut_open`, `shortcut_delete`,
`backup_export`, `backup_import`.
Fora da Vercel, o script simplesmente não carrega e nada quebra.
