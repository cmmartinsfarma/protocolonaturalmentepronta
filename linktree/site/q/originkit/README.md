# Snow Fall (Originkit)

Componente buscado pelo MCP da Originkit em 2026-11-25:

- ferramenta: `get_component`
- id/nome: `snowfall` — **Snow Fall**
- página: https://www.originkit.dev/components/snowfall
- stack devolvida: `framer` (fonte as-authored)
- preset embutido no export default: 632 flocos, vento -1, tamanho 0,5–1,5, velocidade 0,8–2,7, branco, caindo.

## Arquivos

- `snowfall.tsx` — fonte exata devolvida pelo MCP. Não editar.
- `snowfall-mount.tsx` — montagem React mínima usada pela página estática; renderiza `<Snowfall />` sem sobrescrever props.
- `../assets/snowfall.js` — bundle de produção autossuficiente (React 18.3.1 + componente + montagem), gerado com esbuild. ~146 KB minificado, carregado sob demanda.

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

- Na seção escura **A noite**, dentro de `.night__snow` (z-index 1, atrás do conteúdo e abaixo das cortinas).
- O loader em `index.html` baixa `assets/snowfall.js?v=1` só quando `#noite` chega a 400px da viewport, monta quando a seção aparece e desmonta quando sai.
- Não roda no modo app (`?app=1`) nem com `prefers-reduced-motion: reduce`.
