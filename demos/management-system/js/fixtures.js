(function () {
  'use strict';

  function dayOffset(offset, hour, minute) {
    var date = new Date();
    date.setHours(hour || 9, minute || 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date.toISOString();
  }

  function createInitialState() {
    return {
      mode: 'view',
      route: 'dashboard',
      records: [
        { id: 'REC-001', title: 'Registro 001', category: 'Item de demonstração', status: 'Em acompanhamento', responsible: 'Responsável A', note: 'Exemplo fictício para demonstrar consulta e edição local.' },
        { id: 'REC-002', title: 'Registro 002', category: 'Item de demonstração', status: 'Pendente', responsible: 'Responsável B', note: 'Exemplo fictício vinculado a um processo.' },
        { id: 'REC-003', title: 'Registro 003', category: 'Item de demonstração', status: 'Concluído', responsible: 'Responsável A', note: 'Exemplo fictício concluído.' }
      ],
      processes: [
        { id: 'PRO-001', title: 'Processo 001', recordId: 'REC-001', status: 'Em análise', summary: 'Acompanhamento fictício do Registro 001.' },
        { id: 'PRO-002', title: 'Processo 002', recordId: 'REC-002', status: 'Aguardando atualização', summary: 'Acompanhamento fictício do Registro 002.' }
      ],
      pendencies: [
        { id: 'PEN-001', title: 'Pendência 001', processId: 'PRO-001', recordId: 'REC-001', status: 'Aberta', note: 'Item fictício para demonstrar atualização de status.' },
        { id: 'PEN-002', title: 'Pendência 002', processId: 'PRO-002', recordId: 'REC-002', status: 'Em acompanhamento', note: 'Item fictício para demonstrar vínculo entre módulos.' }
      ],
      responsibilities: [
        { recordId: 'REC-001', responsible: 'Responsável A' },
        { recordId: 'REC-002', responsible: 'Responsável B' },
        { recordId: 'REC-003', responsible: 'Responsável A' }
      ],
      events: [
        { id: 'EVE-001', title: 'Revisar Registro 001', startsAt: dayOffset(0, 9, 0), note: 'Compromisso fictício.' },
        { id: 'EVE-002', title: 'Atualizar Processo 002', startsAt: dayOffset(1, 14, 0), note: 'Compromisso fictício.' },
        { id: 'EVE-003', title: 'Verificar Pendência 001', startsAt: dayOffset(3, 10, 30), note: 'Compromisso fictício.' }
      ],
      history: [
        { id: 'HIS-001', text: 'Demonstração local iniciada com dados fictícios.', source: 'Sistema local', at: dayOffset(-1, 8, 0) },
        { id: 'HIS-002', text: 'Registro 001 incluído como exemplo de acompanhamento.', source: 'Sistema local', at: dayOffset(-1, 8, 5) }
      ]
    };
  }

  window.ManagementFixtures = { createInitialState: createInitialState };
}());

