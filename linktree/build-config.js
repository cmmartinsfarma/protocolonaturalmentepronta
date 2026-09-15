// Gera o config.js a partir das variáveis de ambiente (ex.: Vercel).
// Localmente: `node build-config.js` (sem SHEET_ID -> mantém o mock).
const fs = require('fs');
const path = require('path');

const SHEET_ID = process.env.SHEET_ID || '';
const SHEET_LINKS = process.env.SHEET_LINKS || 'Sheet1';
const SHEET_CONFIG = process.env.SHEET_CONFIG || 'Sheet2';
const RANGE_LINKS = process.env.RANGE_LINKS || 'A:F';
const RANGE_CONFIG = process.env.RANGE_CONFIG || 'A:B';

const content = `// Arquivo gerado automaticamente por build-config.js.
// Configure SHEET_ID na variável de ambiente da Vercel.
const CONFIG = {
    SHEET_ID: ${JSON.stringify(SHEET_ID)},
    SHEET_LINKS: ${JSON.stringify(SHEET_LINKS)},
    SHEET_CONFIG: ${JSON.stringify(SHEET_CONFIG)},
    RANGE_LINKS: ${JSON.stringify(RANGE_LINKS)},
    RANGE_CONFIG: ${JSON.stringify(RANGE_CONFIG)},
};
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), content, 'utf8');
console.log('config.js gerado. SHEET_ID =', SHEET_ID || '(vazio — usando mock)');
