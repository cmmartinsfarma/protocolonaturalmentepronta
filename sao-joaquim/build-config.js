// Gera o config.js a partir das variáveis de ambiente SJB_SHEET_ID ou SHEET_ID (Vercel).
// Localmente: `node build-config.js` (sem a variável -> mantém vazio e o site usa o HTML estático).
const fs = require('fs');
const path = require('path');

const SHEET_ID = process.env.SJB_SHEET_ID || process.env.SHEET_ID || '';

const content = `// Arquivo gerado automaticamente por build-config.js.
const CONFIG = {
  SHEET_ID: ${JSON.stringify(SHEET_ID)},
};
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), content, 'utf8');
console.log('config.js gerado. SHEET_ID =', SHEET_ID || '(vazio — usando conteúdo estático)');
