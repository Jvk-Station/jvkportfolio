(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function render(state, context) {
    var openPendencies = state.pendencies.filter(function (item) { return item.status !== 'Concluída'; }).length;
    var activeProcesses = state.processes.filter(function (item) { return item.status !== 'Concluído'; }).length;
    var upcoming = state.events.filter(function (item) { return new Date(item.startsAt) >= new Date(new Date().setHours(0, 0, 0, 0)); }).length;
    var attention = state.records.filter(function (item) { return item.status !== 'Concluído'; });
    return context.heading('Central', 'Visão resumida da demonstração local.') +
      '<section class="summary-grid">' +
        context.summary('Registros', state.records.length, 'dados fictícios') +
        context.summary('Processos ativos', activeProcesses, 'acompanhamento local') +
        context.summary('Pendências abertas', openPendencies, 'itens fictícios') +
        context.summary('Próximos eventos', upcoming, 'agenda local') +
      '</section>' +
      '<section class="content-grid">' +
        '<article class="card"><header class="card-header"><div><h2>Itens que exigem atenção</h2><p>Registros fictícios ainda não concluídos.</p></div><button class="button small" data-route="records">Ver registros</button></header><div class="card-body"><ul class="list">' +
          attention.map(function (item) { return '<li class="list-item"><div><strong>' + context.escape(item.title) + '</strong><span>' + context.escape(item.category) + ' · ' + context.escape(item.responsible) + '</span></div>' + context.badge(item.status) + '</li>'; }).join('') +
        '</ul></div></article>' +
        '<article class="card"><header class="card-header"><div><h2>Atalhos</h2><p>Fluxos principais da demonstração.</p></div></header><div class="card-body"><div class="quick-actions">' +
          context.quick('Registros', 'records') + context.quick('Processos', 'processes') + context.quick('Agenda', 'calendar') + context.quick('Pendências', 'pendencies') +
        '</div></div></article>' +
      '</section>';
  }

  window.ManagementModules.dashboard = { render: render };
}());

