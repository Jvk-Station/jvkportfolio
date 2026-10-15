// Editorial project content shown by the portfolio. No historical demo URLs.
window.JVKProjectData = [
  {
    id: "01", title: "Sistema de Gestão", status: "IN DEVELOPMENT",
    summary: "Arquitetura institucional e soluções operacionais para a saúde pública, desenvolvidas por etapas.",
    story: [
      "O projeto surgiu da necessidade de organizar processos, documentos, registros, atividades, responsáveis e informações administrativas que estavam distribuídos em controles diferentes.",
      "A ideia foi reunir essas informações e entender suas relações: o que precisava ser consultado, acompanhado, preservado em histórico e acessado por cada perfil.",
      "A proposta evoluiu para módulos de registros, consultas, agenda e planejamento, com banco de dados, autenticação, permissões e análise de dados. O desenvolvimento trouxe aprendizados sobre modelagem de dados, estrutura de sistemas, organização de fluxos e desenvolvimento web."
    ],
    problem: "Informações e rotinas fragmentadas dificultavam a consulta e o acompanhamento conjunto das atividades.",
    development: "A implementação passou a conectar módulos administrativos a uma base de dados e a perfis de acesso. O projeto continua em evolução.",
    capabilities: ["Registros e consultas", "Acompanhamento de atividades", "Agenda e planejamento", "Perfis de acesso e histórico"],
    contribution: "Levantamento de necessidades, organização dos fluxos, desenvolvimento de interfaces, estruturação de dados, configuração de acessos, testes e evolução do sistema.",
    delivered: ["Aplicação web modular com navegação entre áreas", "Estrutura de cadastros, consultas, agenda e acompanhamento", "Integração com banco de dados e mecanismos de controle de acesso", "Demonstração isolada, com registros fictícios"],
    decisions: ["Separar módulos para permitir evolução sem refazer todo o sistema", "Relacionar registros e atividades para facilitar consultas e rastreabilidade", "Considerar diferentes perfis de usuário desde o desenho dos fluxos"],
    evidence: "Capturas do ambiente demonstrativo e protótipo navegável local com dados fictícios. Não representa acesso ao ambiente operacional nem comprova resultados quantitativos de produção.",
    limits: "Projeto em evolução. Os fluxos de demonstração não substituem testes, integrações ou validações do ambiente real.",
    nextSteps: ["Aprimorar a documentação de cada módulo", "Consolidar testes e critérios de validação", "Aprimorar acessibilidade e experiência de uso"],
    demo: { href: "projects/management-system/index.html", label: "Abrir demonstração do sistema" },

    teaserPoints: ["Estrutura institucional e quatro níveis de acesso", "Unidades, higienização, equipamentos e documentos", "Vigilância Sanitária como aplicação independente"],
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
    contribution: "Organização do conteúdo, estruturação da navegação e definição das formas de pesquisa e apresentação de respostas.",
    delivered: ["Estrutura editorial de perguntas e respostas", "Pesquisa e navegação por assuntos", "Demonstração navegável com conteúdos fictícios e filtros contextuais"],
    decisions: ["Separar o acervo do modo como ele é apresentado", "Organizar os assuntos para reduzir a procura manual por respostas", "Manter um exemplo público independente das informações originais"],
    evidence: "A descrição do projeto registra um acervo de mais de 1.000 perguntas e respostas. A demonstração pública usa conteúdo sintético e não reproduz integralmente esse acervo.",
    limits: "As informações de exemplo da demonstração não devem ser usadas como orientações oficiais.",
    nextSteps: ["Revisar padrões de classificação de conteúdo", "Melhorar os caminhos de pesquisa e descoberta", "Documentar como os conteúdos são atualizados"],
    demo: { href: "projects/public-portal/index.html", label: "Experimentar portal demonstrativo" },
    teaserPoints: ["Base editorial estruturada", "Pesquisa e navegação por assunto", "Demonstração pública independente"],

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
    contribution: "Modelagem do fluxo de preenchimento, construção da interface, composição da prévia e tratamento visual de documentos.",
    delivered: ["Editor em etapas com campos guiados", "Pré-visualização do documento durante a edição", "Preparação de layout para impressão e PDF", "Demonstração independente no navegador"],
    decisions: ["Separar dados preenchidos da apresentação final", "Exibir alterações durante a edição para reduzir retrabalho", "Padronizar a estrutura visual antes da geração do documento"],
    evidence: "Protótipo navegável com formulário, prévia e opção de impressão. O PDF final depende dos recursos de impressão do navegador.",
    limits: "É uma demonstração de edição, não um sistema de assinatura digital, protocolo ou arquivamento institucional.",
    nextSteps: ["Testar modelos de documento em diferentes tamanhos de tela", "Revisar acessibilidade dos campos", "Ampliar os testes de impressão"],
    demo: { href: "projects/documento-vivo/index.html", label: "Abrir editor demonstrativo" },
    teaserPoints: ["Editor com preenchimento guiado", "Prévia simultânea do documento", "Preparação para impressão e PDF"],

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
    contribution: "Estudo de informações geográficas, organização de camadas e exploração de ferramentas para análise territorial.",
    delivered: ["Exploração inicial de mapas e dados territoriais", "Estudo de camadas e atributos geográficos", "Definição de perguntas para análises agrícolas"],
    decisions: ["Relacionar dados ao território antes de produzir indicadores", "Separar as fontes cartográficas das interpretações", "Evitar conclusões sem dados suficientes para validação"],
    evidence: "Estudo exploratório descrito no portfólio. Ainda não há uma demonstração pública funcional conectada a esta página.",
    limits: "Não é um produto implantado ou um serviço de monitoramento agrícola em produção.",
    nextSteps: ["Selecionar conjunto público ou fictício de dados", "Criar uma visualização demonstrativa reproduzível", "Documentar fontes, projeções e limites de interpretação"],
    teaserPoints: ["Leitura territorial de propriedades", "Estudo com QGIS e camadas", "Projeto exploratório em evolução"],

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
    contribution: "Concepção de uma forma de registrar atividades e estudar sua distribuição ao longo do tempo.",
    delivered: ["Definição do problema de análise temporal", "Estrutura conceitual de eventos, categorias e períodos", "Estudo de indicadores de volume de registros"],
    decisions: ["Não equiparar quantidade registrada à produtividade individual", "Distinguir o momento da atividade do momento do registro", "Construir indicadores que permitam interpretação contextual"],
    evidence: "Conceito em desenvolvimento. Não há resultados operacionais publicados nem demonstração interativa vinculada a esta página.",
    limits: "O Pulse não é apresentado como ferramenta validada de avaliação de desempenho de pessoas.",
    nextSteps: ["Validar o modelo de registro", "Definir dados mínimos e regras de leitura", "Construir uma demonstração com dados fictícios"],
    teaserPoints: ["Leitura temporal de atividades", "Categorias, períodos e volume", "Ainda em estruturação conceitual"],

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
    contribution: "Criação de formulário inicial para movimentação de materiais e estudo de um fluxo digital de controle de estoque.",
    delivered: ["Formulário inicial de registro no Google Forms", "Organização do problema de entradas, saídas e movimentações", "Proposta de evolução para um sistema de estoque"],
    decisions: ["Começar com uma ferramenta simples, de rápida adoção", "Registrar movimentações antes de propor automações complexas", "Separar o controle inicial da visão de sistema futuro"],
    evidence: "A experiência descrita parte de um formulário usado para apoiar registros. O sistema completo de almoxarifado permanece como proposta, não entrega pública concluída.",
    limits: "Não há demonstração pública do formulário original ou de sistema completo de estoque.",
    nextSteps: ["Desenhar cadastro de materiais e tipos de movimentação", "Definir conferências, responsáveis e histórico", "Prototipar consultas e relatórios com dados fictícios"],
    teaserPoints: ["Origem em formulário operacional", "Entradas, saídas e movimentações", "Escalada para controle de estoque"],

    technologies: ["Google Forms"]
  }
];
