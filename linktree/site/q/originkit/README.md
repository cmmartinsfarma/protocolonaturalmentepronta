# Snow Fall (Originkit)

Componente buscado pelo MCP da Originkit em 2026-11-25:

- ferramenta: `get_component`
- id/nome: `snowfall` — **Snow Fall**
- página: https://www.originkit.dev/components/snowfall
- stack devolvida: `framer` (fonte as-authored)
- preset embutido no export default: 632 flocos, vento -1, tamanho 0,5–1,5, velocidade 0,8–2,7, branco, caindo.

## Arquivos

- `snowfall.tsx` — fonte exata devolvida pelo MCP. Não editar.
- `snowfall-flakes.tsx` — variante local derivada da fonte acima: desenha flocos de 6 braços (três linhas cruzadas) em vez de círculos e adiciona rotação lenta por floco. O resto da animação é o mesmo.
- `snowfall-mount.tsx` — montagem React mínima usada pela página estática; renderiza a variante com a cor do evento, densidade, tamanho e opacidade ajustados. O resto das props é o preset embutido no componente.
- `../assets/snowfall.js` — bundle de produção autossuficiente (React 18.3.1 + variante + montagem), gerado com esbuild. ~146 KB minificado, carregado sob demanda.

## Build

```sh
cd originkit
npm init -y
npm install react@18.3.1 react-dom@18.3.1 esbuild
node build.mjs
```

O bundle já está commitado; o deploy da Vercel não precisa de build.

O brief do MCP menciona Tailwind v4, mas a fonte devolvida não usa classes Tailwind — só estilos inline — então o Tailwind não foi adicionado.

## Onde entra

- Camada fixa em todo o site (`.site-snow`, z-index 35): acima do conteúdo e abaixo do sticky, do mascote e do fio de progresso.
- Cor dourada `#D2AE6C` via `data-color`; o branco sumiria no pergaminho. No escuro, vira neve de palco.
- 360 flocos no desktop e 180 no celular, tamanho 2–4,5 e opacidade 20–60%, para manter a leveza no toque.
- O loader em `index.html` baixa `assets/snowfall.js?v=4` depois que a página fica ociosa (`requestIdleCallback`), sem competir com o primeiro paint.
- Não roda no modo app (`?app=1`) nem com `prefers-reduced-motion: reduce`.
