import { build } from "esbuild";

await build({
  entryPoints: ["snowfall-mount.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "OriginkitSnowfall",
  jsx: "automatic",
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
  outfile: "../assets/snowfall.js",
});
