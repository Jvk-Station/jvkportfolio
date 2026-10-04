(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function processTitle(state, id) { var item = state.processes.find(function (process) { return process.id === id; }); return item ? item.title : 'Sem processo'; }

  function render(state, context) {
    var editable = context.canEdit(state);
    return context.heading('Pendências', 'Itens fictícios vinculados a registros e processos.') +
      '<section class="card"><div class="card-body"><div class="table-scroll"><table class="data-table"><thead><tr><th>Pendência</th><th>Vínculo</th><th>Status</th><th></th></tr></thead><tbody>' +
      state.pendencies.map(function (item) { return '<tr><td><strong>' + context.escape(item.title) + '</strong><br><span class="topbar-subtitle">' + context.escape(item.note) + '</span></td><td>' + context.escape(processTitle(state, item.processId)) + '</td><td>' + (editable ? '<select data-pendency-id="' + item.id + '"><option' + context.selected(item.status, 'Aberta') + '>Aberta</option><option' + context.selected(item.status, 'Em acompanhamento') + '>Em acompanhamento</option><option' + context.selected(item.status, 'Concluída') + '>Concluída</option></select>' : context.badge(item.status)) + '</td><td>' + (editable ? '<button class="button small" data-save-pendency="' + item.id + '">Salvar</button>' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div></div></section>';
  }

  function bind(state, context) {
    document.querySelectorAll('[data-save-pendency]').forEach(function (button) {
      button.onclick = function () {
        var id = button.dataset.savePendency;
        var status = document.querySelector('[data-pendency-id="' + id + '"]').value;
        context.mutate(function (next) { var item = next.pendencies.find(function (candidate) { return candidate.id === id; }); item.status = status; context.history(next, item.title + ' teve o status atualizado localmente.'); });
        context.toast('Pendência atualizada localmente.', 'success');
      };
    });
  }

  window.ManagementModules.pendencies = { render: render, bind: bind };
}());

