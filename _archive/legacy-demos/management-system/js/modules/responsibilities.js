(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function render(state, context) {
    var editable = context.canEdit(state);
    return context.heading('Responsabilidades', 'Relação demonstrativa entre registros e responsáveis fictícios.') +
      '<section class="card"><div class="card-body"><div class="table-scroll"><table class="data-table"><thead><tr><th>Registro</th><th>Responsável</th><th></th></tr></thead><tbody>' +
      state.responsibilities.map(function (item) { var record = state.records.find(function (candidate) { return candidate.id === item.recordId; }); return '<tr><td><strong>' + context.escape(record ? record.title : item.recordId) + '</strong></td><td>' + (editable ? '<select data-responsibility-id="' + item.recordId + '"><option' + context.selected(item.responsible, 'Responsável A') + '>Responsável A</option><option' + context.selected(item.responsible, 'Responsável B') + '>Responsável B</option></select>' : context.escape(item.responsible)) + '</td><td>' + (editable ? '<button class="button small" data-save-responsibility="' + item.recordId + '">Salvar</button>' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div></div></section>';
  }

  function bind(state, context) {
    document.querySelectorAll('[data-save-responsibility]').forEach(function (button) {
      button.onclick = function () {
        var id = button.dataset.saveResponsibility;
        var value = document.querySelector('[data-responsibility-id="' + id + '"]').value;
        context.mutate(function (next) {
          var relation = next.responsibilities.find(function (item) { return item.recordId === id; });
          var record = next.records.find(function (item) { return item.id === id; });
          relation.responsible = value; if (record) record.responsible = value;
          context.history(next, 'Responsabilidade de ' + (record ? record.title : id) + ' atualizada localmente.');
        });
        context.toast('Responsabilidade atualizada localmente.', 'success');
      };
    });
  }

  window.ManagementModules.responsibilities = { render: render, bind: bind };
}());

