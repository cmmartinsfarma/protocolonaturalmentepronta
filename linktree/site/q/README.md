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
- A oferta é dirigida a "alguns convidados selecionados"; ajuste esse texto no hero se a regra mudar.

## Identidade visual

A página segue o cartaz do evento: azul-meia-noite, veludo bordô, dourado e papel pergaminho, com serifa clássica, molduras finas e o título "O Quebra-Nozes" no cabeçalho.

## Placeholders para completar

- **Logo da escola:** já incluído em `assets/liberte-dance-studio.png`, com fundo transparente e recorte. Aparece na faixa de programa e como crédito grande na seção "A noite".
- **Teatro:** o cartaz atualizado informa **Teatro Pedro II · Ribeirão Preto**. O endereço completo ainda não foi informado.
- **Fotos:** não haverá galeria pós-apresentação. A seção "A noite" é uma lembrança com o crédito da escola, sem imagens do espetáculo.
- **Mensagem da Dra.:** a seção biográfica foi removida para enxugar a página. Se quiser, a mensagem entra como link/vídeo na faixa de patrocínio, que já leva ao site.
- **Oferta:** validar o percentual e as regras com a clínica.

A página está com `noindex,follow`. Se quiser que ela apareça no Google, remova essa meta no `<head>`.

## Atalhos pessoais

A seção **Seus atalhos** é funcional e local:

- Adicionar, editar e excluir links.
- Sugestões iniciais de WhatsApp, Instagram e site.
- Dados em `localStorage`, chave `qn:atalhos:v1`. Nada vai para servidor.
- Exportar backup em `meus-atalhos-quebra-nozes.json` e importar em outro aparelho.
- Para zerar: limpar os dados do site no navegador ou rodar `localStorage.removeItem("qn:atalhos:v1")` no console.

O avatar é gerado pela inicial do título, sem chamada a serviço de favicon.

## Mascote

O Quebra-Nozes é um SVG autoral inline (`assets/nutcracker.svg` é a versão fonte). Ele acompanha o scroll:

- mensagem e pose mudam por seção (boas-vindas, oferta, atalhos, noite, despedida);
- braços e queixo animados, com tilt suave;
- em telas até 1200px ele aparece por ~3,6s a cada seção e some; no desktop fica no canto;
- respeita `prefers-reduced-motion` e fica oculto para leitores de tela (`aria-hidden`).

## Mobile

O mobile é a superfície principal (toque NFC). A página prioriza:

- CTA, oferta e data na primeira dobra.
- Link "Adicionar à tela inicial" já no hero.
- Faixa de programa em duas colunas.
- Alvos de toque de 44px nos atalhos, sugestões, diálogo e links secundários.
- Sticky de agendamento acessível e com `safe-area`.
- Retrato reduzido para encurtar o primeiro scroll.
- Fluxo enxuto: oferta → atalhos → noite → patrocínio. "O cuidado" e o card "Guarde esta página" foram removidos; a instalação fica no hero.

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
Eventos: `cta_hero`, `cta_coupon`, `cta_sticky`, `cta_footer`, `add_home`,
`shortcut_add`, `shortcut_edit`, `shortcut_open`, `shortcut_delete`,
`backup_export`, `backup_import`.
Fora da Vercel, o script simplesmente não carrega e nada quebra.
