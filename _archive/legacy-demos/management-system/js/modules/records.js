(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function render(state, context) {
    var editable = context.canEdit(state);
    var actions = editable ? '<button class="button primary" data-action="new-record">Adicionar registro</button>' : '';
    return context.heading('Registros', 'Consulta, filtro e edição demonstrativa de registros fictícios.', actions) +
      '<section class="card"><div class="card-body"><div class="filters"><label class="filter-field">Buscar<input id="recordSearch" type="search" placeholder="Buscar por registro"></label><label class="filter-field">Status<select id="recordStatusFilter"><option value="">Todos</option><option>Em acompanhamento</option><option>Pendente</option><option>Concluído</option></select></label><button class="button" id="clearRecordFilters">Limpar filtros</button></div><div id="recordTable"></div></div></section>';
  }

  function table(state, context, query, status) {
    var rows = state.records.filter(function (item) {
      var matchesQuery = !query || (item.title + ' ' + item.category).toLowerCase().indexOf(query.toLowerCase()) >= 0;
      return matchesQuery && (!status || item.status === status);
    });
    if (!rows.length) return '<p class="empty-state">Nenhum registro corresponde aos filtros.</p>';
    return '<div class="table-scroll"><table class="data-table"><thead><tr><th>Registro</th><th>Categoria</th><th>Status</th><th>Responsável</th><th></th></tr></thead><tbody>' +
      rows.map(function (item) { return '<tr><td><strong>' + context.escape(item.title) + '</strong></td><td>' + context.escape(item.category) + '</td><td>' + context.badge(item.status) + '</td><td>' + context.escape(item.responsible) + '</td><td><div class="row-actions"><button class="button small" data-record-id="' + item.id + '">Abrir</button></div></td></tr>'; }).join('') +
      '</tbody></table></div>';
  }

  function bind(state, context) {
    var target = document.getElementById('recordTable');
    var search = document.getElementById('recordSearch');
    var status = document.getElementById('recordStatusFilter');
    function refresh() { target.innerHTML = table(context.state(), context, search.value.trim(), status.value); bindTable(context); }
    function bindTable(ctx) { target.querySelectorAll('[data-record-id]').forEach(function (button) { button.onclick = function () { ctx.navigate('record:' + button.dataset.recordId); }; }); }
    search.oninput = refresh;
    status.onchange = refresh;
    document.getElementById('clearRecordFilters').onclick = function () { search.value = ''; status.value = ''; refresh(); };
    var add = document.querySelector('[data-action="new-record"]');
    if (add) add.onclick = function () { openRecordForm(context); };
    refresh();
  }

  function renderDetail(state, context, id) {
    var item = state.records.find(function (record) { return record.id === id; });
    if (!item) return context.notFound('Registro não encontrado.');
    var editable = context.canEdit(state);
    var recordProcesses = state.processes.filter(function (process) { return process.recordId === item.id; });
    var recordPendencies = state.pendencies.filter(function (pendency) { return pendency.recordId === item.id; });
    var controls = '<button class="button" data-route="records">Voltar</button>' + (editable ? '<button class="button primary" data-action="edit-record" data-record-id="' + item.id + '">Editar localmente</button>' : '');
    return context.heading(item.title, 'Detalhe de um registro fictício.', controls) +
      '<section class="content-grid equal"><article class="card"><header class="card-header"><div><h2>Informações</h2><p>Dados somente demonstrativos.</p></div></header><div class="card-body"><div class="detail-grid">' +
        context.detail('Código', item.id) + context.detail('Status', context.badge(item.status), true) + context.detail('Categoria', item.category) + context.detail('Responsável', item.responsible) + context.detail('Observação', item.note, false, true) +
      '</div></div></article><article class="card"><header class="card-header"><div><h2>Relacionamentos</h2><p>Processos e pendências vinculados.</p></div></header><div class="card-body"><ul class="list">' +
        (recordProcesses.map(function (process) { return '<li class="list-item"><div><strong>' + context.escape(process.title) + '</strong><span>' + context.escape(process.summary) + '</span></div><button class="button small" data-route="process:' + process.id + '">Abrir</button></li>'; }).join('') || '<li class="empty-state">Sem processos vinculados.</li>') +
        (recordPendencies.map(function (pendency) { return '<li class="list-item"><div><strong>' + context.escape(pendency.title) + '</strong><span>' + context.escape(pendency.note) + '</span></div>' + context.badge(pendency.status) + '</li>'; }).join('') || '') +
      '</ul></div></article></section>';
  }

  function openRecordForm(context, record) {
    var item = record || { id: '', title: '', category: 'Item de demonstração', status: 'Em acompanhamento', responsible: 'Responsável A', note: '' };
    var isNew = !record;
    context.openModal(isNew ? 'Adicionar registro' : 'Editar registro',
      '<form id="recordForm" class="detail-grid"><label class="detail-field">Nome do registro<input name="title" required value="' + context.attr(item.title) + '"></label><label class="detail-field">Status<select name="status"><option' + context.selected(item.status, 'Em acompanhamento') + '>Em acompanhamento</option><option' + context.selected(item.status, 'Pendente') + '>Pendente</option><option' + context.selected(item.status, 'Concluído') + '>Concluído</option></select></label><label class="detail-field">Responsável<select name="responsible"><option' + context.selected(item.responsible, 'Responsável A') + '>Responsável A</option><option' + context.selected(item.responsible, 'Responsável B') + '>Responsável B</option></select></label><label class="detail-field full">Observação<textarea name="note">' + context.escape(item.note) + '</textarea></label></form>',
      '<button class="button" data-close-modal>Cancelar</button><button class="button primary" id="saveRecord">Salvar localmente</button>');
    document.getElementById('saveRecord').onclick = function () {
      var form = document.getElementById('recordForm');
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var title = data.get('title').trim();
      context.mutate(function (state) {
        if (isNew) {
          var number = String(state.records.length + 1).padStart(3, '0');
          state.records.push({ id: 'REC-' + number, title: title || 'Registro ' + number, category: 'Item de demonstração', status: data.get('status'), responsible: data.get('responsible'), note: data.get('note').trim() });
          context.history(state, 'Novo registro fictício adicionado localmente.');
        } else {
          var target = state.records.find(function (candidate) { return candidate.id === item.id; });
          target.title = title; target.status = data.get('status'); target.responsible = data.get('responsible'); target.note = data.get('note').trim();
          context.history(state, target.title + ' foi atualizado localmente.');
        }
      });
      context.closeModal(); context.toast('Alteração salva somente neste navegador.', 'success');
      context.navigate(isNew ? 'records' : 'record:' + item.id);
    };
  }

  function bindDetail(state, context, id) {
    var edit = document.querySelector('[data-action="edit-record"]');
    if (edit) edit.onclick = function () { openRecordForm(context, context.state().records.find(function (item) { return item.id === id; })); };
  }

  window.ManagementModules.records = { render: render, bind: bind, renderDetail: renderDetail, bindDetail: bindDetail };
}());

