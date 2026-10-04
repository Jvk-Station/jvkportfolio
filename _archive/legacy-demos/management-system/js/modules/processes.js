(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function recordTitle(state, id) { var item = state.records.find(function (record) { return record.id === id; }); return item ? item.title : 'Registro não encontrado'; }

  function render(state, context) {
    return context.heading('Processos', 'Acompanhamento local de processos fictícios.') +
      '<section class="card"><div class="card-body"><div class="table-scroll"><table class="data-table"><thead><tr><th>Processo</th><th>Registro vinculado</th><th>Status</th><th></th></tr></thead><tbody>' +
      state.processes.map(function (item) { return '<tr><td><strong>' + context.escape(item.title) + '</strong><br><span class="topbar-subtitle">' + context.escape(item.summary) + '</span></td><td>' + context.escape(recordTitle(state, item.recordId)) + '</td><td>' + context.badge(item.status) + '</td><td><div class="row-actions"><button class="button small" data-process-id="' + item.id + '">Abrir</button></div></td></tr>'; }).join('') +
      '</tbody></table></div></div></section>';
  }

  function bind(state, context) { document.querySelectorAll('[data-process-id]').forEach(function (button) { button.onclick = function () { context.navigate('process:' + button.dataset.processId); }; }); }

  function renderDetail(state, context, id) {
    var item = state.processes.find(function (process) { return process.id === id; });
    if (!item) return context.notFound('Processo não encontrado.');
    var linkedPendencies = state.pendencies.filter(function (pendency) { return pendency.processId === id; });
    var controls = '<button class="button" data-route="processes">Voltar</button>' + (context.canEdit(state) ? '<button class="button primary" data-action="edit-process" data-process-id="' + id + '">Atualizar status</button>' : '');
    return context.heading(item.title, 'Detalhe de um processo fictício.', controls) +
      '<section class="content-grid equal"><article class="card"><header class="card-header"><div><h2>Informações</h2><p>Relacionamento demonstrativo.</p></div></header><div class="card-body"><div class="detail-grid">' +
      context.detail('Código', item.id) + context.detail('Status', context.badge(item.status), true) + context.detail('Registro vinculado', '<button class="button small" data-route="record:' + item.recordId + '">' + context.escape(recordTitle(state, item.recordId)) + '</button>') + context.detail('Resumo', item.summary, false, true) +
      '</div></div></article><article class="card"><header class="card-header"><div><h2>Pendências</h2><p>Itens vinculados ao processo.</p></div></header><div class="card-body"><ul class="list">' +
      (linkedPendencies.map(function (pendency) { return '<li class="list-item"><div><strong>' + context.escape(pendency.title) + '</strong><span>' + context.escape(pendency.note) + '</span></div>' + context.badge(pendency.status) + '</li>'; }).join('') || '<li class="empty-state">Sem pendências vinculadas.</li>') +
      '</ul></div></article></section>';
  }

  function bindDetail(state, context, id) {
    var button = document.querySelector('[data-action="edit-process"]');
    if (!button) return;
    button.onclick = function () {
      var item = context.state().processes.find(function (process) { return process.id === id; });
      context.openModal('Atualizar status do processo', '<label class="detail-field">Status<select id="processStatus"><option' + context.selected(item.status, 'Em análise') + '>Em análise</option><option' + context.selected(item.status, 'Aguardando atualização') + '>Aguardando atualização</option><option' + context.selected(item.status, 'Concluído') + '>Concluído</option></select></label>', '<button class="button" data-close-modal>Cancelar</button><button class="button primary" id="saveProcess">Salvar localmente</button>');
      document.getElementById('saveProcess').onclick = function () {
        var nextStatus = document.getElementById('processStatus').value;
        context.mutate(function (next) { var target = next.processes.find(function (process) { return process.id === id; }); target.status = nextStatus; context.history(next, target.title + ' teve o status atualizado localmente.'); });
        context.closeModal(); context.toast('Status atualizado localmente.', 'success'); context.navigate('process:' + id);
      };
    };
  }

  window.ManagementModules.processes = { render: render, bind: bind, renderDetail: renderDetail, bindDetail: bindDetail };
}());

