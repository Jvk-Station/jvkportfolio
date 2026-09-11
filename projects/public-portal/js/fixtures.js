(() => {
  const audiences = [
    { id: "audience-01", label: "Público 01", description: "Contexto fictício de consulta.", tone: "violet" },
    { id: "audience-02", label: "Público 02", description: "Outro contexto fictício de consulta.", tone: "teal" },
  ];

  const categories = [
    { id: "a1-c1", audienceId: "audience-01", label: "Categoria 01", description: "Grupo fictício de conteúdos." },
    { id: "a1-c2", audienceId: "audience-01", label: "Categoria 02", description: "Grupo fictício de conteúdos." },
    { id: "a1-c3", audienceId: "audience-01", label: "Categoria 03", description: "Grupo fictício de conteúdos." },
    { id: "a2-c1", audienceId: "audience-02", label: "Categoria 01", description: "Grupo fictício de conteúdos." },
    { id: "a2-c2", audienceId: "audience-02", label: "Categoria 02", description: "Grupo fictício de conteúdos." },
    { id: "a2-c3", audienceId: "audience-02", label: "Categoria 03", description: "Grupo fictício de conteúdos." },
  ];

  const subcategories = [
    { id: "a1-c1-s1", categoryId: "a1-c1", label: "Subcategoria 01" },
    { id: "a1-c1-s2", categoryId: "a1-c1", label: "Subcategoria 02" },
    { id: "a1-c2-s1", categoryId: "a1-c2", label: "Subcategoria 01" },
    { id: "a1-c3-s1", categoryId: "a1-c3", label: "Subcategoria 01" },
    { id: "a2-c1-s1", categoryId: "a2-c1", label: "Subcategoria 01" },
    { id: "a2-c2-s1", categoryId: "a2-c2", label: "Subcategoria 01" },
    { id: "a2-c2-s2", categoryId: "a2-c2", label: "Subcategoria 02" },
    { id: "a2-c3-s1", categoryId: "a2-c3", label: "Subcategoria 01" },
  ];

  const contentTypes = [
    { id: "type-01", label: "Tipo 01" },
    { id: "type-02", label: "Tipo 02" },
    { id: "type-03", label: "Tipo 03" },
  ];

  const createContent = (number, audienceId, categoryId, subcategoryId, typeId, relatedIds, areaIds) => ({
    id: `content-${number}`,
    audienceId,
    categoryId,
    subcategoryId,
    typeId,
    title: `Conteúdo ${number}`,
    summary: "Este é um conteúdo fictício utilizado exclusivamente para demonstrar a organização e a descoberta de informações.",
    blocks: [
      { title: "Bloco 01", text: "Texto fictício para demonstrar uma seção organizada de conteúdo." },
      { title: "Bloco 02", text: "Este bloco é local, abstrato e não representa orientação ou procedimento." },
      { title: "Bloco 03", text: "Estrutura adicional usada somente para demonstrar leitura por partes." },
    ],
    reference: { label: "Referência 01", text: "Referência fictícia utilizada para demonstrar a estrutura do conteúdo." },
    relatedIds,
    areaIds,
  });

  const contents = [
    createContent("001", "audience-01", "a1-c1", "a1-c1-s1", "type-01", ["content-002", "content-004"], ["area-01", "area-03"]),
    createContent("002", "audience-01", "a1-c1", "a1-c1-s2", "type-02", ["content-001", "content-005"], ["area-01"]),
    createContent("003", "audience-01", "a1-c2", "a1-c2-s1", "type-03", ["content-004", "content-006"], ["area-02", "area-04"]),
    createContent("004", "audience-01", "a1-c2", "a1-c2-s1", "type-01", ["content-003", "content-001"], ["area-03"]),
    createContent("005", "audience-01", "a1-c3", "a1-c3-s1", "type-02", ["content-006", "content-002"], ["area-05"]),
    createContent("006", "audience-01", "a1-c3", "a1-c3-s1", "type-03", ["content-005", "content-003"], ["area-04", "area-05"]),
    createContent("007", "audience-02", "a2-c1", "a2-c1-s1", "type-01", ["content-008", "content-010"], ["area-06"]),
    createContent("008", "audience-02", "a2-c1", "a2-c1-s1", "type-02", ["content-007", "content-009"], ["area-07", "area-03"]),
    createContent("009", "audience-02", "a2-c2", "a2-c2-s1", "type-03", ["content-010", "content-008"], ["area-02", "area-07"]),
    createContent("010", "audience-02", "a2-c2", "a2-c2-s2", "type-01", ["content-009", "content-007"], ["area-04"]),
    createContent("011", "audience-02", "a2-c3", "a2-c3-s1", "type-02", ["content-012", "content-009"], ["area-05", "area-06"]),
    createContent("012", "audience-02", "a2-c3", "a2-c3-s1", "type-03", ["content-011", "content-008"], ["area-06", "area-07"]),
  ];

  const layers = [
    { id: "layer-01", label: "Camada 01", legend: ["Nível A", "Nível B", "Nível C"] },
    { id: "layer-02", label: "Camada 02", legend: ["Nível A", "Nível B", "Nível C"] },
    { id: "layer-03", label: "Camada 03", legend: ["Nível A", "Nível B", "Nível C"] },
  ];

  const syntheticAreas = [
    { id: "area-01", label: "Área 01", audienceId: "audience-01", categoryId: "a1-c1", path: "M58 84 L192 54 L244 142 L176 218 L62 180 Z", statuses: { "layer-01": "A", "layer-02": "B", "layer-03": "C" } },
    { id: "area-02", label: "Área 02", audienceId: "audience-01", categoryId: "a1-c2", path: "M318 66 L444 82 L470 178 L382 212 L302 142 Z", statuses: { "layer-01": "B", "layer-02": "C", "layer-03": "A" } },
    { id: "area-03", label: "Área 03", audienceId: "audience-02", categoryId: "a2-c1", path: "M548 54 L700 78 L680 186 L572 164 L520 102 Z", statuses: { "layer-01": "C", "layer-02": "A", "layer-03": "B" } },
    { id: "area-04", label: "Área 04", audienceId: "audience-01", categoryId: "a1-c3", path: "M124 292 L250 258 L306 356 L218 426 L96 380 Z", statuses: { "layer-01": "A", "layer-02": "C", "layer-03": "B" } },
    { id: "area-05", label: "Área 05", audienceId: "audience-02", categoryId: "a2-c2", path: "M382 276 L510 246 L566 342 L492 424 L356 386 Z", statuses: { "layer-01": "B", "layer-02": "A", "layer-03": "C" } },
    { id: "area-06", label: "Área 06", audienceId: "audience-02", categoryId: "a2-c3", path: "M632 270 L758 304 L736 414 L606 398 L578 322 Z", statuses: { "layer-01": "C", "layer-02": "B", "layer-03": "A" } },
    { id: "area-07", label: "Área 07", audienceId: "audience-02", categoryId: "a2-c1", path: "M278 464 L424 452 L462 522 L334 554 L248 516 Z", statuses: { "layer-01": "A", "layer-02": "B", "layer-03": "C" } },
  ];

  const syntheticPoints = [
    { id: "point-01", label: "Ponto 01", kind: "Marcador 01", areaId: "area-01", x: 148, y: 132, relatedContentIds: ["content-001", "content-002"] },
    { id: "point-02", label: "Ponto 02", kind: "Marcador 02", areaId: "area-03", x: 616, y: 118, relatedContentIds: ["content-008"] },
    { id: "point-03", label: "Ponto 03", kind: "Marcador 01", areaId: "area-05", x: 454, y: 326, relatedContentIds: ["content-009", "content-010"] },
    { id: "point-04", label: "Ponto 04", kind: "Marcador 02", areaId: "area-06", x: 672, y: 348, relatedContentIds: ["content-011", "content-012"] },
  ];

  const featured = { contentId: "content-003", label: "Destaque 01", text: "Destaque fictício usado como outro caminho de descoberta dentro do Portal." };
  const notice = { contentId: "content-009", label: "Aviso 01", text: "Aviso fictício e local que direciona para um conteúdo de demonstração." };

  window.PortalFixtures = { audiences, categories, subcategories, contentTypes, contents, layers, syntheticAreas, syntheticPoints, featured, notice };
})();
