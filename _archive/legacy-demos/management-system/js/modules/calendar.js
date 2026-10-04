(function () {
  'use strict';
  window.ManagementModules = window.ManagementModules || {};

  function monthLabel(date) { return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); }
  function dayKey(date) { return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-'); }
  function timeLabel(date) { return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }

  function render(state, context) {
    var today = new Date();
    var first = new Date(today.getFullYear(), today.getMonth(), 1);
    var offset = (first.getDay() + 6) % 7;
    var count = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    var cells = [];
    for (var blank = 0; blank < offset; blank += 1) cells.push('<div class="calendar-cell empty"></div>');
    for (var day = 1; day <= count; day += 1) {
      var date = new Date(today.getFullYear(), today.getMonth(), day);
      var events = state.events.filter(function (event) { return dayKey(new Date(event.startsAt)) === dayKey(date); });
      cells.push('<div class="calendar-cell"><span class="calendar-number">' + day + '</span>' + events.map(function (event) { return '<button class="event-chip" data-event-id="' + event.id + '" title="' + context.attr(event.title) + '">' + context.escape(timeLabel(new Date(event.startsAt))) + ' · ' + context.escape(event.title) + '</button>'; }).join('') + '</div>');
    }
    var controls = context.canEdit(state) ? '<button class="button primary" data-action="new-event">Adicionar evento</button>' : '';
    return context.heading('Calendário e agenda', 'Poucos compromissos fictícios, exibidos apenas nesta demonstração.', controls) +
      '<section class="calendar-layout"><article class="card"><header class="card-header"><div><h2>' + context.escape(monthLabel(today)) + '</h2><p>Visão local do mês atual.</p></div></header><div class="card-body"><div class="calendar-grid"><div class="calendar-day-name">Seg</div><div class="calendar-day-name">Ter</div><div class="calendar-day-name">Qua</div><div class="calendar-day-name">Qui</div><div class="calendar-day-name">Sex</div><div class="calendar-day-name">Sáb</div><div class="calendar-day-name">Dom</div>' + cells.join('') + '</div></div></article>' +
      '<article class="card"><header class="card-header"><div><h2>Próximos eventos</h2><p>Agenda fictícia.</p></div></header><div class="card-body"><ul class="list">' +
      state.events.slice().sort(function (a, b) { return new Date(a.startsAt) - new Date(b.startsAt); }).map(function (event) { return '<li class="list-item"><div><strong>' + context.escape(event.title) + '</strong><span>' + context.escape(new Date(event.startsAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })) + '</span></div><button class="button small" data-event-id="' + event.id + '">Abrir</button></li>'; }).join('') +
      '</ul></div></article></section>';
  }

  function bind(state, context) {
    document.querySelectorAll('[data-event-id]').forEach(function (button) { button.onclick = function () { openEvent(context, button.dataset.eventId); }; });
    var add = document.querySelector('[data-action="new-event"]');
    if (add) add.onclick = function () { openEvent(context); };
  }

  function openEvent(context, id) {
    var state = context.state();
    var event = state.events.find(function (item) { return item.id === id; });
    var editable = context.canEdit(state);
    var localDate = event ? new Date(event.startsAt) : new Date();
    var defaultValue = localDate.getFullYear() + '-' + String(localDate.getMonth() + 1).padStart(2, '0') + '-' + String(localDate.getDate()).padStart(2, '0') + 'T' + String(localDate.getHours()).padStart(2, '0') + ':' + String(localDate.getMinutes()).padStart(2, '0');
    var body = '<div class="detail-grid"><div class="detail-field"><span>Evento</span><div class="detail-value">' + context.escape(event ? event.title : 'Novo evento fictício') + '</div></div><div class="detail-field"><span>Data e hora</span><div class="detail-value">' + context.escape(event ? localDate.toLocaleString('pt-BR') : 'Defina uma data local') + '</div></div><div class="detail-field full"><span>Observação</span><div class="detail-value">' + context.escape(event ? event.note : 'Item demonstrativo para a agenda local.') + '</div></div></div>';
    var footer = '<button class="button" data-close-modal>Fechar</button>';
    if (editable) {
      body = '<form id="eventForm" class="detail-grid"><label class="detail-field">Evento<input name="title" required value="' + context.attr(event ? event.title : '') + '"></label><label class="detail-field">Data e hora<input name="startsAt" type="datetime-local" required value="' + defaultValue + '"></label><label class="detail-field full">Observação<textarea name="note">' + context.escape(event ? event.note : '') + '</textarea></label></form>';
      footer = '<button class="button" data-close-modal>Cancelar</button><button class="button primary" id="saveEvent">Salvar localmente</button>';
    }
    context.openModal(event ? 'Detalhe do evento' : 'Adicionar evento', body, footer);
    var save = document.getElementById('saveEvent');
    if (!save) return;
    save.onclick = function () {
      var form = document.getElementById('eventForm'); if (!form.reportValidity()) return;
      var data = new FormData(form);
      context.mutate(function (next) {
        if (event) { var target = next.events.find(function (item) { return item.id === id; }); target.title = data.get('title').trim(); target.startsAt = new Date(data.get('startsAt')).toISOString(); target.note = data.get('note').trim(); context.history(next, 'Evento fictício atualizado localmente.'); }
        else { var number = String(next.events.length + 1).padStart(3, '0'); next.events.push({ id: 'EVE-' + number, title: data.get('title').trim(), startsAt: new Date(data.get('startsAt')).toISOString(), note: data.get('note').trim() }); context.history(next, 'Novo evento fictício adicionado à agenda local.'); }
      });
      context.closeModal(); context.toast('Agenda atualizada localmente.', 'success'); context.navigate('calendar');
    };
  }

  window.ManagementModules.calendar = { render: render, bind: bind };
}());

