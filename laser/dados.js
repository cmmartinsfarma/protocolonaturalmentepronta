// Carrega data/local e as tabelas de preço da planilha do linktree (abas com prefixo rp_).
// Se SHEET_ID não estiver configurado (ou a planilha falhar), mantém o HTML estático.
(function () {
  'use strict';

  var SITE = 'rp'; // abas: rp_config, rp_feminino, rp_masculino, rp_clareamento, rp_tatuagem, rp_outros
  var SHEET_ID = (typeof CONFIG !== 'undefined' && CONFIG && CONFIG.SHEET_ID)
    ? String(CONFIG.SHEET_ID).trim()
    : '';

  if (!SHEET_ID) {
    console.info('[dados] SHEET_ID não configurado — mantendo conteúdo estático.');
    return;
  }

  function parseGviz(text) {
    var start = text.indexOf('{');
    var end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Resposta inválida da planilha');
    return JSON.parse(text.substring(start, end + 1));
  }

  function gvizToValues(json) {
    var table = (json && json.table) || {};
    var labels = (table.cols || []).map(function (c) {
      return c && c.label ? String(c.label).trim() : '';
    });
    var rows = (table.rows || []).map(function (row) {
      return (row.c || []).map(function (cell) {
        if (!cell) return '';
        var v = (cell.f !== undefined && cell.f !== null) ? cell.f : cell.v;
        return v === undefined || v === null ? '' : String(v).trim();
      });
    });
    return { labels: labels, rows: rows };
  }

  function fetchSheet(tab, range) {
    var url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(SHEET_ID) +
      '/gviz/tq?tqx=out:json&sheet=' + encodeURIComponent(tab) + '&range=' + encodeURIComponent(range);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Erro ao buscar aba ' + tab + ': ' + r.status);
      return r.text();
    }).then(function (text) {
      return gvizToValues(parseGviz(text));
    });
  }

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function parseDateValue(v) {
    var s = String(v || '').trim();
    if (!s) return null;
    var m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/); // DD/MM/AAAA
    if (m) return { d: +m[1], m: +m[2], y: +m[3] };
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); // AAAA-MM-DD
    if (m) return { d: +m[3], m: +m[2], y: +m[1] };
    return null;
  }

  function pad2(n) {
    return ('0' + n).slice(-2);
  }

  function isHeaderRow(row) {
    var first = String((row && row[0]) || '').toLowerCase().trim();
    return /^(área|area|tamanho|procedimento|chave)$/.test(first);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderTable(table, data) {
    if (!table || !data) return;
    var values = data.rows || [];
    var labels = data.labels || [];
    if (!values.length) return;

    var hasLabels = labels.some(function (l) { return l !== ''; });

    var headers, rows;
    if (hasLabels) {
      // O gviz manda o cabeçalho em "cols[].label" (ex.: rp_outros).
      headers = labels;
      rows = values;
    } else {
      // Senão, procura a linha de cabeçalho (tolera uma linha de título acima).
      var headerIndex = null;
      for (var i = 0; i < Math.min(values.length, 4); i++) {
        if (isHeaderRow(values[i])) { headerIndex = i; break; }
      }

      if (headerIndex !== null) {
        headers = values[headerIndex];
        rows = values.slice(headerIndex + 1);
      } else {
        headers = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) {
          return th.textContent.trim();
        });
        rows = values;
      }
    }

    rows = rows.filter(function (r) {
      return r.some(function (c) { return String(c).trim() !== ''; });
    });
    if (!headers.length || !rows.length) return;

    var thead = table.querySelector('thead');
    var tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    thead.innerHTML = '<tr>' + headers.map(function (h) {
      return '<th scope="col">' + escapeHtml(h) + '</th>';
    }).join('') + '</tr>';

    tbody.innerHTML = rows.map(function (r) {
      return '<tr>' + headers.map(function (_, i) {
        return '<td>' + escapeHtml(r[i] === undefined ? '' : r[i]) + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function applyConfig(values) {
    var cfg = {};
    values.forEach(function (row) {
      var key = String(row[0] || '').trim().toLowerCase();
      if (key && key !== 'chave') cfg[key] = String(row[1] || '').trim();
    });

    var local = cfg.local || '';
    if (!local) {
      var heroLocal = document.querySelector('.hero__date strong');
      local = heroLocal ? heroLocal.textContent.trim() : '';
    }
    var dataTexto = cfg.data_texto || '';
    var dataIso = cfg.data_iso || '';

    // Fonte principal: "data" em DD/MM/AAAA. Formata para ISO e texto.
    var parsed = parseDateValue(cfg.data) || parseDateValue(dataIso);
    if (parsed && parsed.m >= 1 && parsed.m <= 12) {
      dataIso = parsed.y + '-' + pad2(parsed.m) + '-' + pad2(parsed.d);
      dataTexto = parsed.d + ' de ' + MESES[parsed.m - 1];
    }

    var heroDate = document.querySelector('.hero__date');
    if (heroDate && (local || dataTexto)) {
      heroDate.innerHTML = [dataTexto, local ? '<strong>' + escapeHtml(local) + '</strong>' : '']
        .filter(Boolean).join(' · ');
    }

    var brandTitle = document.querySelector('.nav__brand-title');
    if (brandTitle && local) brandTitle.textContent = 'Laser Day · ' + local;

    if (dataTexto) {
      var footerQuote = document.querySelector('.footer__quote');
      if (footerQuote) footerQuote.textContent = 'Laser Day · ' + dataTexto + ' · Vagas limitadas';
    }

    var badge = document.querySelector('.contato__badge');
    if (badge) {
      var spans = badge.querySelectorAll('span');
      if (spans[0] && local) spans[0].textContent = '📍 ' + local;
      if (spans[2] && dataTexto) spans[2].textContent = '🗓️ ' + dataTexto;
    }

    if (local || dataTexto) {
      document.querySelectorAll('.faq__item').forEach(function (item) {
        var q = item.querySelector('.faq__question');
        if (!q || !/onde acontece/i.test(q.textContent)) return;
        var a = item.querySelector('.faq__answer');
        if (!a) return;
        a.innerHTML = 'O evento acontece em <strong>' + escapeHtml(local) + '</strong>' +
          (dataTexto ? ', no dia ' + escapeHtml(dataTexto) : '') +
          '. O local e o horário exatos são confirmados no momento do agendamento, pelo WhatsApp.';
      });
    }

    if (dataIso) {
      var parts = dataIso.split('-');
      if (parts.length === 3) {
        var ddmm = parts[2] + '/' + parts[1];
        var tagEl = document.querySelector('.hero__event-tag');
        if (tagEl) tagEl.textContent = tagEl.textContent.replace(/\d{2}\/\d{2}/g, ddmm);

        // Atualiza a data nas seções que ainda podem estar com a data fixa.
        ['beneficios-desc', 'pros-desc', 'faq-desc', 'contato-title'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.innerHTML = el.innerHTML.replace(/\d{2}\/\d{2}/g, ddmm);
        });

        if (document.title) document.title = document.title.replace(/\d{2}\/\d{2}/g, ddmm);
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', metaDesc.getAttribute('content').replace(/\d{2}\/\d{2}/g, ddmm));
        }
      }
    }

    var parcelas = (cfg.parcelas || cfg.qtd_max_parcelas || '').trim();
    if (parcelas) {
      var depend = /\bou\b/i.test(parcelas) ? ', dependendo da quantidade de sessões fechadas' : '';
      var disc = document.getElementById('price-disclaimer');
      if (disc) {
        disc.innerHTML = '💳 Parcelamento em <strong>' + escapeHtml(parcelas) + 'x' + depend +
          '</strong>, com acréscimo de juros conforme as taxas da operadora do cartão. O valor parcelado é confirmado no agendamento.';
      }
      var faqParcelado = document.getElementById('faq-parcelado');
      if (faqParcelado) {
        faqParcelado.innerHTML = 'Sim! O parcelamento é em <strong>' + escapeHtml(parcelas) + 'x' + depend +
          '</strong>, com acréscimo de juros conforme as taxas da operadora do cartão.';
      }
    }

    if (cfg.whatsapp) {
      document.querySelectorAll('a[href*="whatsapp.com"]').forEach(function (a) {
        a.href = a.href.replace(/phone=\d+/, 'phone=' + encodeURIComponent(cfg.whatsapp));
      });
    }
  }

  var TABLES = [
    { tab: 'feminino', selectors: ['#panel-f-epilacao table.price-table'] },
    { tab: 'clareamento', selectors: ['#panel-f-clareamento table.price-table'] },
    { tab: 'tatuagem', selectors: ['#panel-f-tatuagem table.price-table', '#panel-m-tatuagem table.price-table'] },
    { tab: 'outros', selectors: ['#panel-f-outros table.price-table', '#panel-m-outros table.price-table'] },
    { tab: 'masculino', selectors: ['#panel-m-depilacao table.price-table'] }
  ];

  function run() {
    fetchSheet(SITE + '_config', 'A:B').then(function (data) {
      applyConfig(data.rows || []);
    }).catch(function (e) {
      console.warn('[dados] configuração:', e);
    });

    TABLES.forEach(function (item) {
      fetchSheet(SITE + '_' + item.tab, 'A:E').then(function (data) {
        item.selectors.forEach(function (sel) {
          document.querySelectorAll(sel).forEach(function (t) {
            renderTable(t, data);
          });
        });
      }).catch(function (e) {
        console.warn('[dados] aba ' + SITE + '_' + item.tab + ':', e);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
