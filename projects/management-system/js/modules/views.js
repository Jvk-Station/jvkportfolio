(function () {
const { icon } = window.VetraIcons;

const titles = {
  overview: ['Visão geral', 'Agora'], records: ['Registros', 'Operação'], flows: ['Fluxos', 'Operação'],
  calendar: ['Agenda', 'Planejamento'], organizations: ['Organizações', 'Base'], tasks: ['Pendências', 'Operação'],
  reports: ['Relatórios', 'Leitura'], activity: ['Atividade', 'Histórico'], settings: ['Configurações', 'Sistema']
};
const configs = {
  records: { collection: 'records', singular: 'registro', plural: 'registros', icon: 'records', columns: ['Nome', 'Categoria', 'Situação', ''], fields: ['group', 'status'] },
  flows: { collection: 'flows', singular: 'fluxo', plural: 'fluxos', icon: 'flow', columns: ['Título', 'Etapa', 'Situação', ''], fields: ['stage', 'status'] },
  organizations: { collection: 'organizations', singular: 'organização', plural: 'organizações', icon: 'directory', columns: ['Nome', 'Identificador', 'Situação', ''], fields: ['identifier', 'status'] },
  calendar: { collection: 'events', singular: 'evento', plural: 'eventos', icon: 'calendar', columns: ['Título', 'Data', 'Horário', ''], fields: ['date', 'time'] },
  tasks: { collection: 'tasks', singular: 'pendência', plural: 'pendências', icon: 'tasks', columns: ['Título', 'Prioridade', 'Situação', ''], fields: ['priority', 'status'] }
};

const esc = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
const date = value => value ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : '—';
const timestamp = value => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const badge = (value = '') => `<span class="badge ${/conclu|feito|ativo/i.test(value) ? 'done' : /andamento|agenda/i.test(value) ? 'progress' : 'open'}">${esc(value || 'Aberto')}</span>`;

function heading(route, action = '') {
  const [title, eyebrow] = titles[route] || ['', ''];
  return `<header class="page-head"><div><p class="page-eyebrow">${eyebrow}</p><h1 class="page-title">${title}</h1></div>${action ? `<div class="head-actions">${action}</div>` : ''}</header>`;
}

function button(label, kind = '', attrs = '') { return `<button class="button ${kind}" ${attrs}>${label}</button>`; }
function newButton(type, label) { return button(`${icon('plus')}${label}`, 'primary', `data-add="${type}"`); }
function emptyPanel(type, title, action = 'Novo') { return `<div class="empty-panel"><div class="empty-symbol">${icon(configs[type]?.icon || 'grid')}</div><h3>${title}</h3>${newButton(type, action)}</div>`; }

function overview(state) {
  const total = state.records.length + state.flows.length + state.tasks.length + state.events.length;
  const actionList = [
    ['records', 'Registro', 'records'], ['flows', 'Fluxo', 'flow'], ['calendar', 'Evento', 'calendar'], ['tasks', 'Pendência', 'tasks']
  ].map(([type, label, glyph]) => `<button class="quick" data-add="${type}">${icon(glyph)}<strong>${label}</strong></button>`).join('');
  const activity = state.activity.slice(0, 4);
  return `${heading('overview', newButton('records', 'Novo registro'))}
    <section class="overview-grid">
      <article class="card signal-card"><p class="mono">Gestão / ${String(total).padStart(2, '0')}</p><h2>Campo de <em>trabalho</em></h2><p>Registre. Organize. Siga.</p><div class="focus-empty"><span>${total ? 'Em movimento' : 'Sem itens'}</span><div class="focus-orbit"><i></i><i></i><b>${String(total).padStart(2, '0')}</b></div></div></article>
      <article class="card"><div class="card-top"><h2 class="card-title">Criar</h2><span class="mono">Novo</span></div><div class="quick-grid">${actionList}</div></article>
    </section>
    <section class="data-strip">
      ${metric('Registros', state.records.length, 'line-blue')}${metric('Fluxos', state.flows.length, 'line-orange')}${metric('Pendências', state.tasks.filter(item => item.status !== 'Concluída').length, 'line-lime')}${metric('Agenda', state.events.length, 'line-dim')}
    </section>
    <section class="split-grid"><article class="card"><div class="card-top"><h2 class="card-title">Atividade</h2><button class="list-action" data-route="activity">Abrir</button></div>${activity.length ? activityList(activity) : emptyPanel('records', 'Sem atividade', 'Novo registro')}</article><article class="card"><div class="card-top"><h2 class="card-title">Próximo</h2><span class="mono">Agenda</span></div>${state.events.length ? simpleList(state.events.slice(0, 3), 'calendar') : emptyPanel('calendar', 'Sem eventos', 'Novo evento')}</article></section>`;
}

function metric(label, value, line) { return `<article class="card metric ${line}"><span class="mono">${label}</span><div class="metric-value">${String(value).padStart(2, '0')}<span>itens</span></div></article>`; }
function activityList(items) { return `<div class="list">${items.map(item => `<div class="list-row"><div><strong class="list-title">${esc(item.label)}</strong><span class="list-meta">${timestamp(item.at)}</span></div><span class="badge progress">${esc(item.kind)}</span></div>`).join('')}</div>`; }
function simpleList(items, type) { return `<div class="list">${items.map(item => `<div class="list-row"><div><strong class="list-title">${esc(item.title)}</strong><span class="list-meta">${type === 'calendar' ? `${date(item.date)} ${item.time || ''}` : esc(item.status || '')}</span></div>${badge(item.status || 'Agendado')}<button class="list-action" data-route="detail:${type}:${item.id}">Abrir</button></div>`).join('')}</div>`; }

function collection(route, state) {
  const config = configs[route];
  const items = state[config.collection];
  const itemRows = items.map(item => row(item, route, config)).join('');
  const content = items.length ? `<div class="table-head">${config.columns.map(column => `<span>${column}</span>`).join('')}</div><div id="collectionRows">${itemRows}</div>` : emptyPanel(route, `Sem ${config.plural}`, `Novo ${config.singular}`);
  return `${heading(route, newButton(route, `Novo ${config.singular}`))}<section class="card table-card"><div class="table-toolbar"><span class="mono">${String(items.length).padStart(2, '0')} ${config.plural}</span>${items.length ? `<label class="sr-only" for="collectionSearch">Buscar</label><input id="collectionSearch" class="search" autocomplete="off" placeholder="Buscar">` : ''}</div>${content}</section>`;
}

function row(item, route, config) {
  const metaA = route === 'calendar' ? date(item.date) : item[config.fields[0]] || '—';
  const metaB = route === 'calendar' ? item.time || '—' : item[config.fields[1]] || 'Aberto';
  return `<div class="table-row" data-search="${esc(`${item.title} ${metaA} ${metaB}`).toLowerCase()}"><div><strong>${esc(item.title)}</strong><small>${item.createdAt ? timestamp(item.createdAt) : ''}</small></div><span>${esc(metaA)}</span>${badge(metaB)}<button class="list-action" data-route="detail:${route}:${item.id}">Abrir</button></div>`;
}

function reports(state) {
  const numbers = [ ['Registros', state.records.length, 'line-blue'], ['Fluxos', state.flows.length, 'line-orange'], ['Pendências', state.tasks.length, 'line-lime'], ['Agenda', state.events.length, 'line-dim'] ];
  const total = numbers.reduce((sum, entry) => sum + entry[1], 0);
  return `${heading('reports')}<section class="data-strip">${numbers.map(entry => metric(entry[0], entry[1], entry[2])).join('')}</section><section class="split-grid"><article class="card"><div class="card-top"><h2 class="card-title">Volume</h2><span class="mono">Total ${String(total).padStart(2, '0')}</span></div>${total ? '<div class="chart-placeholder"></div>' : emptyPanel('records', 'Sem dados', 'Novo registro')}</article><article class="card"><div class="card-top"><h2 class="card-title">Leitura</h2><span class="mono">Atual</span></div>${total ? `<div class="list">${numbers.filter(entry => entry[1]).map(entry => `<div class="list-row"><strong>${entry[0]}</strong><span class="badge progress">${entry[1]} itens</span></div>`).join('')}</div>` : emptyPanel('flows', 'Sem movimento', 'Novo fluxo')}</article></section>`;
}

function activity(state) { return `${heading('activity')}${state.activity.length ? `<section class="card"><div class="card-top"><h2 class="card-title">Linha do tempo</h2><span class="mono">${String(state.activity.length).padStart(2, '0')}</span></div>${activityList(state.activity)}</section>` : `<section class="card">${emptyPanel('records', 'Sem atividade', 'Novo registro')}</section>`}`; }

function settings() { return `${heading('settings')}<section class="split-grid"><article class="card"><div class="card-top"><h2 class="card-title">Armazenamento</h2><span class="badge done">Local</span></div><div class="list"><div class="list-row"><div><strong class="list-title">Dados do navegador</strong><span class="list-meta">GESTÃO / LOCAL</span></div><button class="button danger" data-reset>Limpar</button></div></div></article><article class="card"><div class="card-top"><h2 class="card-title">Aparência</h2><span class="mono">Escura</span></div><div class="empty-panel"><div class="empty-symbol">${icon('mark')}</div><h3>Sistema de Gestão</h3></div></article></section>`; }

function detail(route, id, state) {
  const config = configs[route];
  const item = state[config.collection].find(entry => entry.id === id);
  if (!item) return `${heading(route)}<section class="card">${emptyPanel(route, 'Item não encontrado', `Novo ${config.singular}`)}</section>`;
  const info = route === 'calendar' ? [['Data', date(item.date)], ['Horário', item.time || '—'], ['Situação', 'Agendado']] : config.fields.map(field => [field === 'group' ? 'Categoria' : field === 'stage' ? 'Etapa' : field === 'identifier' ? 'Identificador' : field === 'priority' ? 'Prioridade' : 'Situação', item[field] || '—']);
  return `${heading(route, `<button class="button danger" data-delete="${route}:${id}">${icon('trash')}Excluir</button>`)}<section class="split-grid"><article class="card"><div class="card-top"><div><p class="page-eyebrow">${config.singular}</p><h2 class="card-title" style="font-size:22px">${esc(item.title)}</h2></div>${badge(item.status || 'Agendado')}</div><div class="list">${info.map(([label,value]) => `<div class="list-row"><span class="list-meta">${label}</span><strong>${esc(value)}</strong></div>`).join('')}<div class="list-row"><span class="list-meta">Criado</span><strong>${timestamp(item.createdAt)}</strong></div></div></article><article class="card"><div class="card-top"><h2 class="card-title">Ações</h2></div><div class="empty-panel"><div class="empty-symbol">${icon(config.icon)}</div><button class="button" data-route="${route}">Voltar</button></div></article></section>`;
}

function render(route, state) {
  if (route.startsWith('detail:')) { const [, type, id] = route.split(':'); return detail(type, id, state); }
  if (route === 'overview') return overview(state);
  if (configs[route]) return collection(route, state);
  if (route === 'reports') return reports(state);
  if (route === 'activity') return activity(state);
  return settings();
}

function form(type) {
  const config = configs[type] || configs.records;
  const fields = {
    records: `<div class="field full"><label>Nome</label><input name="title" required autocomplete="off"></div><div class="field"><label>Categoria</label><input name="group" autocomplete="off"></div><div class="field"><label>Situação</label><select name="status"><option>Aberto</option><option>Em andamento</option><option>Concluído</option></select></div>`,
    flows: `<div class="field full"><label>Título</label><input name="title" required autocomplete="off"></div><div class="field"><label>Etapa</label><input name="stage" autocomplete="off"></div><div class="field"><label>Situação</label><select name="status"><option>Aberto</option><option>Em andamento</option><option>Concluído</option></select></div>`,
    organizations: `<div class="field full"><label>Nome</label><input name="title" required autocomplete="off"></div><div class="field"><label>Identificador</label><input name="identifier" autocomplete="off"></div><div class="field"><label>Situação</label><select name="status"><option>Ativo</option><option>Em análise</option><option>Inativo</option></select></div>`,
    calendar: `<div class="field full"><label>Título</label><input name="title" required autocomplete="off"></div><div class="field"><label>Data</label><input type="date" name="date" required></div><div class="field"><label>Horário</label><input type="time" name="time"></div>`,
    tasks: `<div class="field full"><label>Título</label><input name="title" required autocomplete="off"></div><div class="field"><label>Prioridade</label><select name="priority"><option>Normal</option><option>Importante</option><option>Urgente</option></select></div><div class="field"><label>Situação</label><select name="status"><option>Aberto</option><option>Em andamento</option><option>Concluída</option></select></div>`
  };
  return `<div class="modal-backdrop" data-modal-close><form class="modal" data-create="${type}"><header class="modal-head"><div><h2>Novo ${config.singular}</h2><p>Sistema de Gestão</p></div><button class="close" type="button" data-modal-close aria-label="Fechar">×</button></header><div class="modal-body"><div class="form-grid">${fields[type] || fields.records}</div></div><footer class="modal-foot"><button class="button" type="button" data-modal-close>Cancelar</button>${button('Salvar', 'primary', 'type="submit"')}</footer></form></div>`;
}
window.VetraViews = { render, form };
}());
