# Planilha do Laser Day — São Joaquim da Barra

O site lê os dados do Google Sheets pelas abas com prefixo `sjb_`. Se a planilha
não estiver configurada (ou falhar), a página continua usando o HTML estático.

## Abas

| Aba | Conteúdo | Colunas |
| --- | --- | --- |
| `sjb_config` | Data, local, WhatsApp e parcelas | `chave` / `valor` |
| `sjb_feminino` | Epilação feminino | Área, Sessão avulsa, Combo (6 meses), Combo (10 meses) |
| `sjb_masculino` | Epilação masculino | Área, Sessão avulsa, Combo (6 meses), Combo (10 meses) |
| `sjb_clareamento` | Epilação + clareamento | Áreas, Sessão avulsa, Combo 6 sessões, Combo 10 sessões |
| `sjb_tatuagem` | Remoção de tatuagem (fem. e masc.) | Tamanho, Por sessão |
| `sjb_outros` | Outros procedimentos (fem. e masc.) | Procedimento, Sessão avulsa, 3 sessões |

O arquivo `template/laserday-sao-joaquim.xlsx` já vem com todas as abas e os
valores atuais da página. Importe-o no Google Sheets (ou copie as abas para a
planilha existente) e compartilhe com “qualquer pessoa com o link”.

## Chaves do `sjb_config`

| chave | Exemplo | Uso |
| --- | --- | --- |
| `data` | `31/10/2026` | Data do evento (DD/MM/AAAA). Atualiza hero, FAQ, contato, rodapé e JSON-LD. |
| `local` | `São Joaquim da Barra / SP` | Cidade exibida no hero, navbar, badge e FAQ. |
| `endereco` | `Rua ...` | Reservado para o endereço completo. |
| `whatsapp` | `5516992133717` | Substitui o telefone dos links do WhatsApp. |
| `parcelas` | `6 ou 10` | Texto do parcelamento no aviso de preços e no FAQ. |

## Configuração na Vercel

Defina a variável de ambiente `SJB_SHEET_ID` (ou `SHEET_ID`) com o ID da
planilha no projeto da Vercel que publica esta pasta. O `build-config.js` gera
o `config.js` no build.

Sem a variável, o site permanece com os valores do HTML (fallback estático).
