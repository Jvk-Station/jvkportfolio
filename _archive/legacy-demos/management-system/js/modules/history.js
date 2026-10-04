(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function render(state, context) {
    var items = state.history.slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
    return context.heading('Histórico', 'Eventos fictícios, incluindo ações realizadas nesta demonstração.') +
      '<section class="card"><header class="card-header"><div><h2>Atividades locais</h2><p>O histórico é salvo apenas neste navegador quando a edição está ativa.</p></div></header><div class="card-body">' +
      (items.length ? items.map(function (item) { return '<div class="history-entry"><span class="history-dot"></span><div><strong>' + context.escape(item.text) + '</strong><small>' + context.escape(item.source) + ' · ' + context.escape(new Date(item.at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })) + '</small></div></div>'; }).join('') : '<p class="empty-state">Nenhum evento local registrado.</p>') +
      '</div></section>';
  }

  window.ManagementModules.history = { render: render };
}());

