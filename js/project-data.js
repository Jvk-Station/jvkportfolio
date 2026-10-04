// Editorial project content shown by the portfolio. No historical demo URLs.
window.JVKProjectData = [
  {
    id: "01", title: "Sistema de Gestão", status: "IN DEVELOPMENT",
    summary: "Organização de processos, registros e rotinas administrativas em uma estrutura modular.",
    story: [
      "O projeto surgiu da necessidade de organizar processos, documentos, registros, atividades, responsáveis e informações administrativas que estavam distribuídos em controles diferentes.",
      "A ideia foi reunir essas informações e entender suas relações: o que precisava ser consultado, acompanhado, preservado em histórico e acessado por cada perfil.",
      "A proposta evoluiu para módulos de registros, consultas, agenda e planejamento, com banco de dados, autenticação, permissões e análise de dados. O desenvolvimento trouxe aprendizados sobre modelagem de dados, estrutura de sistemas, organização de fluxos e desenvolvimento web."
    ],
    problem: "Informações e rotinas fragmentadas dificultavam a consulta e o acompanhamento conjunto das atividades.",
    development: "A implementação passou a conectar módulos administrativos a uma base de dados e a perfis de acesso. O projeto continua em evolução.",
    capabilities: ["Registros e consultas", "Acompanhamento de atividades", "Agenda e planejamento", "Perfis de acesso e histórico"],
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "SQL e modelagem de dados"]
  },
  {
    id: "02", title: "Portal", status: "COMPLETED",
    summary: "Um portal para organizar perguntas, respostas e a consulta de informações de um setor específico.",
    story: [
      "O Portal nasceu da necessidade de reunir informações sobre um setor específico em um site que facilitasse a pesquisa e a consulta.",
      "Durante o desenvolvimento, foi estruturada uma base com mais de 1.000 perguntas e mais de 1.000 respostas relacionadas ao setor.",
      "A organização do conteúdo e da navegação buscou permitir que uma pessoa encontrasse respostas no próprio site, com uma experiência de consulta mais clara."
    ],
    problem: "Tornar um volume grande de perguntas e respostas mais organizado e acessível para consulta.",
    development: "O trabalho concentrou-se na estruturação do conteúdo, na pesquisa e na navegação do portal.",
    capabilities: ["Base com mais de 1.000 perguntas e mais de 1.000 respostas", "Organização de conteúdo", "Pesquisa e navegação para consulta"],
    technologies: []
  },
  {
    id: "03", title: "Padronizações", status: "COMPLETED",
    summary: "Criação de documentos com preenchimento guiado e prévia durante a edição.",
    story: [
      "O projeto surgiu da necessidade de criar documentos de maneira mais padronizada, inclusive para processos relacionados a empresas externas.",
      "A proposta separou o conteúdo da estrutura visual: as informações seriam preenchidas de um lado enquanto uma prévia do documento apareceria ao lado.",
      "A visualização durante a criação permitia acompanhar o resultado, reduzir inconsistências de formatação e manter uma estrutura previamente definida."
    ],
    problem: "Produzir documentos recorrentes sem repetir ajustes manuais de formatação e conferência.",
    development: "Foi desenvolvida uma interface de preenchimento com prévia contínua do documento e preparação para saída em PDF.",
    capabilities: ["Preenchimento guiado", "Prévia do documento", "Estrutura visual padronizada", "Saída em PDF"],
    technologies: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: "04", title: "GEO", status: "IN DEVELOPMENT",
    summary: "Exploração de dados geoespaciais para estudar propriedades agrícolas e seu território.",
    story: [
      "GEO explora a aplicação de geotecnologia no contexto de propriedades agrícolas, usando mapas e dados territoriais para ampliar a leitura espacial das informações.",
      "O estudo considera localização, território, condições ambientais, clima e outras informações espaciais relevantes para a análise de propriedades.",
      "A exploração inclui QGIS, ferramentas geoespaciais e dados relacionados à análise climática. As possibilidades ainda estão sendo investigadas."
    ],
    problem: "Dados sobre uma propriedade perdem parte do contexto quando sua dimensão territorial não é considerada.",
    development: "Estudo em andamento de camadas, mapas e dados geográficos aplicados à leitura de propriedades agrícolas.",
    capabilities: ["Camadas e mapas", "Leitura de dados territoriais", "Exploração de informações ambientais e climáticas"],
    technologies: ["QGIS", "Ferramentas geoespaciais", "Dados geográficos"]
  },
  {
    id: "05", title: "Pulse", status: "IN DEVELOPMENT",
    summary: "Registros de atividades transformados em uma leitura temporal do trabalho realizado.",
    story: [
      "Pulse nasceu da ideia de representar o pulso do trabalho realizado por meio dos registros de atividades executadas.",
      "A proposta é observar quantas atividades ocorreram, de que tipos foram, quando aconteceram e como um período se comportou.",
      "O conceito transforma registros operacionais em uma leitura de atividade, ritmo, volume e tempo. Ainda está em desenvolvimento."
    ],
    problem: "Registros isolados dificultam perceber o ritmo e a distribuição das atividades ao longo do tempo.",
    development: "Exploração de uma leitura temporal dos registros de trabalho, sem atribuição de produtividade individual.",
    capabilitiesLabel: "Leitura proposta",
    capabilities: ["Quantidade e tipos de atividades", "Distribuição por período", "Ritmo e volume dos registros"],
    technologies: []
  },
  {
    id: "06", title: "Logística", status: "IN DEVELOPMENT",
    summary: "Do formulário de movimentação de materiais à ideia de um controle digital de estoque.",
    story: [
      "A origem foi um formulário criado no Google Forms para auxiliar registros de movimentação de materiais durante uma experiência na área de logística.",
      "O controle inicial mostrou que entradas, saídas e movimentações poderiam ser organizadas de maneira mais clara do que em registros dispersos.",
      "A ideia evoluiu conceitualmente para um sistema de apoio ao controle de estoque e almoxarifado, com registros de materiais e acompanhamento das movimentações."
    ],
    problem: "Organizar entradas, saídas e movimentações de materiais sem depender de registros fragmentados.",
    development: "Um formulário simples serviu como ponto de partida para pensar uma estrutura digital mais organizada. A implementação completa do sistema não está documentada publicamente.",
    capabilitiesLabel: "Ponto de partida e escopo",
    capabilities: ["Formulário inicial no Google Forms", "Entradas, saídas e movimentações como escopo da evolução", "Organização de estoque como objetivo do sistema"],
    technologies: ["Google Forms"]
  }
];
