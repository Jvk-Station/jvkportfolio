(function () {
  'use strict';

  var app = document.getElementById('app');
  var modules = window.ManagementModules;
  var stateApi = window.ManagementState;
  var storage = window.ManagementStorage;
  var permissions = window.ManagementPermissions;
  var navItems = [
    ['dashboard', 'Central', '●'],
    ['records', 'Registros', '▤'],
    ['processes', 'Processos', '▣'],
    ['calendar', 'Calendário e agenda', '□'],
    ['responsibilities', 'Responsabilidades', '↔'],
    ['pendencies', 'Pendências', '!'],
    ['history', 'Histórico', '≡']
  ];

  function escape(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]; });
  }

  function attr(value) { return escape(value); }
  function selected(value, expected) { return value === expected ? ' selected' : ''; }

  function badge(value) {
    var label = String(value || 'Sem status');
    var lower = label.toLowerCase();
    var tone = lower.indexOf('conclu') >= 0 ? 'done' : lower.indexOf('pend') >= 0 || lower.indexOf('aberta') >= 0 ? 'open' : lower.indexOf('aguard') >= 0 ? 'alert' : lower.indexOf('análise') >= 0 || lower.indexOf('acompan') >= 0 ? 'progress' : 'neutral';
    return '<span class="badge ' + tone + '">' + escape(label) + '</span>';
  }

  function heading(title, description, actions) {
    return '<div class="page-heading"><div><h1>' + escape(title) + '</h1><p>' + escape(description) + '</p></div><div class="row-actions">' + (actions || '') + '</div></div>';
  }

  function summary(label, value, caption) { return '<article class="card summary-card"><span class="summary-label">' + escape(label) + '</span><strong class="summary-value">' + escape(value) + '</strong><span class="summary-caption">' + escape(caption) + '</span></article>'; }
  function quick(label, route) { return '<button class="quick-action" data-route="' + escape(route) + '">' + escape(label) + '</button>'; }
  function detail(label, value, isHtml, full) { return '<div class="detail-field' + (full ? ' full' : '') + '"><span>' + escape(label) + '</span><div class="detail-value">' + (isHtml ? value : escape(value)) + '</div></div>'; }
  function notFound(message) { return heading('Item indisponível', message, '<button class="button" data-route="dashboard">Voltar à Central</button>'); }

  function addHistory(state, text) {
    state.history.push({ id: 'HIS-' + String(state.history.length + 1).padStart(3, '0'), text: text, source: 'Ação local', at: new Date().toISOString() });
  }

  function persist(current) { storage.save(current); }

  function mutate(mutator) {
    stateApi.update(function (current) { mutator(current); persist(current); });
  }

  function navigate(route) {
    mutate(function (current) { current.route = route; });
  }

  function toast(message, tone) {
    var root = document.getElementById('toastRoot');
    var item = document.createElement('div');
    item.className = 'toast ' + (tone || '');
    item.textContent = message;
    root.appendChild(item);
    setTimeout(function () { item.remove(); }, 3200);
  }

  function closeModal() { document.getElementById('modalRoot').innerHTML = ''; }

  function openModal(title, body, footer) {
    var root = document.getElementById('modalRoot');
    root.innerHTML = '<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header class="modal-header"><h2 id="modalTitle">' + escape(title) + '</h2><button class="icon-button" data-close-modal aria-label="Fechar">×</button></header><div class="modal-body">' + body + '</div><footer class="modal-footer">' + (footer || '') + '</footer></section></div>';
    root.querySelectorAll('[data-close-modal]').forEach(function (button) { button.onclick = closeModal; });
    root.querySelector('.modal-backdrop').onclick = function (event) { if (event.target === event.currentTarget) closeModal(); };
  }

  function context() {
    return {
      state: stateApi.get,
      mutate: mutate,
      navigate: navigate,
      toast: toast,
      openModal: openModal,
      closeModal: closeModal,
      history: addHistory,
      escape: escape,
      attr: attr,
      selected: selected,
      badge: badge,
      heading: heading,
      summary: summary,
      quick: quick,
      detail: detail,
      notFound: notFound,
      canEdit: permissions.canEdit
    };
  }

  function renderRoute(current, ctx) {
    var route = current.route || 'dashboard';
    if (route.indexOf('record:') === 0) return modules.records.renderDetail(current, ctx, route.slice(7));
    if (route.indexOf('process:') === 0) return modules.processes.renderDetail(current, ctx, route.slice(8));
    var module = modules[route] || modules.dashboard;
    return module.render(current, ctx);
  }

  function bindRoute(current, ctx) {
    var route = current.route || 'dashboard';
    if (route.indexOf('record:') === 0) return modules.records.bindDetail(current, ctx, route.slice(7));
    if (route.indexOf('process:') === 0) return modules.processes.bindDetail(current, ctx, route.slice(8));
    var module = modules[route] || modules.dashboard;
    if (module.bind) module.bind(current, ctx);
  }

  function render() {
    var current = stateApi.get();
    var ctx = context();
    var baseRoute = String(current.route || 'dashboard').split(':')[0];
    app.className = '';
    app.innerHTML = '<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">Sistema de gestão</span><small>Demonstração local independente</small></div><nav class="main-nav" aria-label="Navegação principal">' +
      navItems.map(function (item) { return '<button class="nav-button' + (baseRoute === item[0] ? ' active' : '') + '" data-route="' + item[0] + '"><span class="nav-icon">' + item[2] + '</span>' + item[1] + '</button>'; }).join('') +
      '</nav><div class="sidebar-note">Demonstração local — todos os dados exibidos são fictícios.</div></aside><section class="workspace"><header class="topbar"><div><div class="topbar-title">Sistema de gestão</div><div class="topbar-subtitle">Ambiente local sem conexão externa</div></div><div class="topbar-actions"><label class="mode-control" for="demoMode">Modo de demonstração<select id="demoMode"><option value="view"' + selected(current.mode, 'view') + '>Visualização</option><option value="edit"' + selected(current.mode, 'edit') + '>Edição</option></select></label><button class="button" id="restoreDemo">Restaurar dados da demonstração</button></div></header><main id="mainContent" class="main-content" tabindex="-1">' + renderRoute(current, ctx) + '</main><footer class="statusbar">Modo atual: ' + (current.mode === 'edit' ? 'Edição demonstrativa local' : 'Visualização') + ' · Nenhuma informação é enviada para serviços externos.</footer></section></div>';
    bindCommon(current, ctx);
    bindRoute(current, ctx);
  }

  function bindCommon(current, ctx) {
    document.querySelectorAll('[data-route]').forEach(function (button) { button.onclick = function () { ctx.navigate(button.dataset.route); }; });
    var mode = document.getElementById('demoMode');
    mode.onchange = function () { mutate(function (next) { next.mode = mode.value; }); toast(mode.value === 'edit' ? 'Edição demonstrativa ativada.' : 'Modo de visualização ativado.', 'success'); };
    document.getElementById('restoreDemo').onclick = function () {
      openModal('Restaurar dados da demonstração', '<p>Esta ação remove somente as alterações fictícias salvas neste navegador e retorna a demonstração ao estado inicial.</p>', '<button class="button" data-close-modal>Cancelar</button><button class="button danger" id="confirmRestore">Restaurar dados</button>');
      document.getElementById('confirmRestore').onclick = function () {
        storage.reset();
        stateApi.replace(window.ManagementFixtures.createInitialState());
        closeModal();
        toast('Dados fictícios restaurados.', 'success');
      };
    };
  }

  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeModal(); });
  var saved = storage.load();
  if (saved) stateApi.replace(saved);
  stateApi.subscribe(render);
  render();
}());

