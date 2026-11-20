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

## Placeholders para completar

- **Logo oficial do evento:** substituir o bloco `.sponsor` no topo pelo logo, quando existir.
- **Teatro e endereço:** não foram informados; a seção "A noite" mostra só data e sessões.
- **Fotos oficiais:** o quadro `Fotos oficiais · em breve` é o espaço reservado. Quando a galeria existir, troque por uma imagem/link.
- **Mensagem da Dra.:** ainda não incluída. Pode entrar como texto ou vídeo curto na seção "A Carolina".
- **Oferta:** validar o percentual e as regras com a clínica.

A página está com `noindex,follow`. Se quiser que ela apareça no Google, remova essa meta no `<head>`.

## Chaveiro

- URL sugerida para gravar nas 200 tags: `https://SEU-DOMINIO/q/` (com barra no final).
- Uma URL para todas as tags; não precisa de slug por unidade.
- Grave com NFC Tools depois que o domínio estiver no ar.
- Teste 3 tags em iPhone e Android antes de gravar o lote.

## Deploy

A página é estática e funciona em qualquer host. Em Vercel, o diretório `q/` vira `/q/`.
Se quiser `/q` sem barra, configure `cleanUrls`/`trailingSlash` no host.

O PWA (instalar na tela inicial) exige HTTPS. Em `localhost` o service worker também funciona.

## Analytics

O script da Vercel Analytics está incluído (`/_vercel/insights/script.js`).
Eventos: `cta_hero`, `cta_coupon`, `cta_sticky`, `cta_footer`, `add_home`.
Fora da Vercel, o script simplesmente não carrega e nada quebra.
