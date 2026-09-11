(() => {
  const supported = ["pt-BR"];
  const storageKey = "jvkportfolio-language";
  const main = document.querySelector("#main-content");
  const modal = document.querySelector("#language-modal");
  const nav = document.querySelector("#site-navigation");
  const menuToggle = document.querySelector(".menu-toggle");
  const languageToggle = document.querySelector(".language-toggle");
  const languageMenu = document.querySelector("#language-menu");
  const languageLabel = document.querySelector("#current-language");
  let locale = null;
  let language = null;

  const escape = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const marked = (value) => escape(value);
  const cleanHeadline = (value) => String(value ?? "").replace(/^(Opa|Hola|Hey)\.\s*/i, "");
  const text = (path) => path.split(".").reduce((value, key) => value?.[key], locale) ?? "";
  const project = (id) => locale.projects.find((item) => item.id === id);
  const portfolioProject = (item) => {
    if (!item || item.id !== "01") return item;
    const copy = {
      "pt-BR": { title: "Sistema de Gestão", summary: "Plataforma para organizar fluxos, registros, agenda e acompanhamento operacional.", overview: "Uma plataforma modular de gestão construída para reunir operações, registros, agenda e acompanhamentos em um único ambiente.", capabilities: ["Registros e organizações", "Fluxos e pendências", "Agenda, leitura e histórico"] },
      en: { title: "Management System", summary: "A platform for organizing workflows, records, schedules and operational follow-up.", overview: "A modular management platform built to bring operations, records, schedules and follow-up into one workspace.", capabilities: ["Records and organizations", "Workflows and tasks", "Schedule, insights and activity"] },
      es: { title: "Sistema de Gestión", summary: "Plataforma para organizar flujos, registros, agenda y seguimiento operativo.", overview: "Una plataforma modular de gestión creada para reunir operaciones, registros, agenda y seguimientos en un único entorno.", capabilities: ["Registros y organizaciones", "Flujos y pendientes", "Agenda, lecturas e historial"] }
    };
    return { ...item, demo: "projects/management-system/index.html", ...(copy[language] || copy["pt-BR"]) };
  };
  const statusClass = (status) => status === "AVAILABLE" ? "available" : "";
  const statusText = (status) => status === "AVAILABLE" ? text("work.available") : text("work.development");

  const showcasePreview = (item) => {
    const visual = window.JVK_SITE_CONFIG?.projectPresentation?.[item.id]?.visual || "management";
    const previews = {
      management: `<div class="preview-ui preview-management"><div class="preview-sidebar"><i></i><i></i><i></i><i></i><i></i></div><div class="preview-main"><div class="preview-top"><span></span><span></span></div><div class="preview-metrics"><b></b><b></b><b></b></div><div class="preview-chart"><svg viewBox="0 0 320 100" preserveAspectRatio="none"><polyline points="0,75 45,64 92,68 138,41 181,52 226,31 270,38 320,19"/></svg></div><div class="preview-row"><span></span><span></span></div></div></div>`,
      portal: `<div class="preview-ui preview-portal"><div class="portal-bar"><span></span><i></i><i></i><i></i></div><div class="portal-copy"><strong></strong><span></span><span></span></div><div class="portal-search"><i></i><span></span><b></b></div><div class="portal-cards"><span></span><span></span><span></span></div><div class="portal-cut"></div></div>`,
      authorflow: `<div class="preview-ui preview-authorflow"><div class="author-controls"><span></span><span></span><span></span><span></span></div><div class="author-doc"><i></i><i></i><i></i><i></i><i></i><b></b></div><div class="author-form"><span></span><span></span><span></span><span></span><span></span></div></div>`,
      map: `<div class="preview-ui preview-map"><svg class="map-lines" viewBox="0 0 360 220" preserveAspectRatio="none"><path d="M-10 185 L62 142 L117 158 L169 101 L224 119 L278 64 L370 82"/><path d="M7 36 L74 68 L129 51 L181 78 L239 41 L303 59 L372 22"/><path d="M62 142 L74 68 M117 158 L129 51 M169 101 L181 78 M224 119 L239 41 M278 64 L303 59"/></svg><div class="map-layers"><b></b><span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div><div class="map-points"><i style="--x:68%;--y:28%"></i><i style="--x:52%;--y:54%"></i><i style="--x:78%;--y:66%"></i><i style="--x:35%;--y:38%"></i><i style="--x:60%;--y:80%"></i></div><div class="map-zoom"><span></span><span></span></div></div>`,
      pulse: `<div class="preview-ui preview-pulse"><div class="pulse-head"><span></span><i></i></div><div class="pulse-metrics"><b></b><b></b><b></b></div><div class="pulse-bars"><i style="--h:44%"></i><i style="--h:68%"></i><i style="--h:39%"></i><i style="--h:82%"></i><i style="--h:56%"></i><i style="--h:73%"></i><i style="--h:48%"></i></div><div class="pulse-axis"><span></span><span></span><span></span><span></span></div></div>`,
      central: `<div class="preview-ui preview-central"><div class="central-nav"><b></b><span></span><span></span><span></span><span></span><span></span></div><div class="central-main"><div class="central-title"><span></span><i></i></div><strong></strong><div class="central-task"><i></i><span></span><b></b></div><div class="central-task"><i></i><span></span><b></b></div><div class="central-task"><i></i><span></span><b></b></div><strong></strong><div class="central-doc"><span></span><i></i></div><div class="central-doc"><span></span><i></i></div></div></div>`
    };
    return previews[visual] || previews.management;
  };

  const showcaseCard = (source) => {
    const item = portfolioProject(source);
    const presentation = window.JVK_SITE_CONFIG?.projectPresentation?.[item.id] || {};
    const tags = (presentation.tags || []).map((tag) => `<span>${escape(tag)}</span>`).join("");
    return `<a class="showcase-card" href="#/project/${item.id}"><div class="showcase-copy"><div class="showcase-meta"><span class="project-index">${escape(item.id)}</span><span class="status ${statusClass(item.status)}">${escape(statusText(item.status))}</span></div><h3>${escape(item.title)}</h3><p>${marked(item.summary)}</p><div class="showcase-tags">${tags}</div></div><div class="showcase-preview" aria-hidden="true">${showcasePreview(item)}</div><span class="showcase-arrow" aria-hidden="true">↗</span></a>`;
  };

  const deckCard = (source, index) => {
    const item = portfolioProject(source);
    return `<article class="project-deck-card" data-deck-index="${index}" tabindex="0" role="button" aria-label="${escape(item.title)}"><div class="deck-card-preview" aria-hidden="true">${showcasePreview(item)}</div><div class="deck-card-copy"><h3>${escape(item.title)}</h3><span class="deck-open">${escape(text("work.view"))} ↗</span></div></article>`;
  };

  const managementScreenPreview = (type) => {
    const previews = {
      overview: `<div class="mg-shot mg-overview"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-shot-body"><aside><span></span><span></span><span></span><span></span></aside><main><div class="mg-kpis"><b></b><b></b><b></b></div><div class="mg-chart"></div><div class="mg-table-line"></div></main></div></div>`,
      records: `<div class="mg-shot mg-records"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-shot-title"></div><div class="mg-record-layout"><div class="mg-list"><span></span><span></span><span></span><span></span><span></span></div><div class="mg-record-detail"><b></b><span></span><span></span><span></span><i></i></div></div></div>`,
      tracking: `<div class="mg-shot mg-tracking"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-tracking-kpis"><span></span><span></span><span></span></div><div class="mg-kanban"><div><b></b><i></i><i></i></div><div><b></b><i></i><i></i></div><div><b></b><i></i><i></i></div></div></div>`,
      calendar: `<div class="mg-shot mg-calendar"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-calendar-layout"><div class="mg-month-grid"></div><div class="mg-agenda-list"><span></span><span></span><span></span><span></span></div></div></div>`,
      responsibilities: `<div class="mg-shot mg-responsibilities"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-resp-head"></div><div class="mg-resp-table"><span></span><span></span><span></span><span></span><span></span></div></div>`,
      reports: `<div class="mg-shot mg-reports"><div class="mg-shot-bar"><i></i><i></i><i></i></div><div class="mg-report-kpis"><span></span><span></span></div><div class="mg-report-grid"><div class="mg-bars"></div><div class="mg-donut"></div></div></div>`
    };
    return previews[type] || previews.overview;
  };

  const managementCopy = () => {
    const copies = {
    "pt-BR": {
      kicker: "SISTEMA DE GESTÃO / SHOWCASE",
      title: "Sistema de Gestão",
      lead: "Cada opção representa uma área do produto. Passe o mouse para destacar a tela e visualizar o que ela representa.",
      demo: "Abrir demonstração funcional",
      screens: [
        ["overview","Visão geral","Indicadores, prioridades e leitura rápida do que exige atenção."],
        ["records","Registros","Cadastros e informações organizadas em uma estrutura única e rastreável."],
        ["tracking","Acompanhamento","Pendências, ações e histórico operacional sem depender de controles dispersos."],
        ["calendar","Agenda","Compromissos, planejamento e visão temporal do trabalho da equipe."],
        ["responsibilities","Responsabilidades","Distribuição de responsáveis e vínculo entre pessoas, áreas e registros."],
        ["reports","Indicadores","Leituras consolidadas para acompanhamento e tomada de decisão."]
      ]
    },
    en: {
      kicker: "MANAGEMENT SYSTEM / SHOWCASE",
      title: "A system view, one layer at a time.",
      lead: "Each option below represents an area of the product. Hover to bring the screen forward and see what it solves inside the workflow.",
      demo: "Open functional demo",
      screens: [
        ["overview","Overview","Indicators, priorities and a fast reading of what needs attention."],
        ["records","Records","Structured information and records in one traceable workspace."],
        ["tracking","Tracking","Tasks, actions and operational history without scattered controls."],
        ["calendar","Schedule","Appointments, planning and a timeline view of the team's work."],
        ["responsibilities","Responsibilities","Ownership and links between people, areas and records."],
        ["reports","Insights","Consolidated views for monitoring and decision-making."]
      ]
    },
    es: {
      kicker: "SISTEMA DE GESTIÓN / SHOWCASE",
      title: "Una visión del sistema por partes.",
      lead: "Cada opción representa un área del producto. Pasa el cursor para traer la pantalla al frente y ver qué resuelve dentro del flujo.",
      demo: "Abrir demostración funcional",
      screens: [
        ["overview","Visión general","Indicadores, prioridades y lectura rápida de lo que requiere atención."],
        ["records","Registros","Información y registros organizados en un espacio único y rastreable."],
        ["tracking","Seguimiento","Pendientes, acciones e historial operativo sin controles dispersos."],
        ["calendar","Agenda","Compromisos, planificación y visión temporal del trabajo del equipo."],
        ["responsibilities","Responsabilidades","Distribución de responsables y vínculos entre personas, áreas y registros."],
        ["reports","Indicadores","Lecturas consolidadas para seguimiento y toma de decisiones."]
      ]
    }
    };
    return copies[language] || copies["pt-BR"];
  };

  const renderManagementProject = () => {
    const item = portfolioProject(project("01"));
    const copy = managementCopy();
    const cards = copy.screens.map(([type,title], index) => `<article class="mg-catalog-card" tabindex="0" data-mg-card="${index}"><div class="mg-catalog-screen">${managementScreenPreview(type)}</div><h3 class="mg-catalog-title">${escape(title)}</h3><div class="mg-catalog-info"><p>Futuro</p></div></article>`).join("");
    return `<div class="management-showcase"><header class="mg-showcase-header"><a class="mg-back" href="#/">← ${escape(text("nav.home"))}</a><span>${escape(copy.kicker)}</span><a class="mg-demo-link" href="${escape(item.demo)}" target="_blank" rel="noopener noreferrer">${escape(copy.demo)} ↗</a></header><section class="mg-showcase-hero"><div><p class="eyebrow">${escape(copy.kicker)}</p><h1>${escape(copy.title)}</h1><p>${escape(copy.lead)}</p></div></section><section class="mg-catalog-section"><div class="mg-catalog-row">${cards}</div></section></div>`;
  };
  const pageHeader = (eyebrow, title, lead) => `<header class="page-header"><p class="eyebrow">${escape(eyebrow)}</p><h1 class="page-title">${marked(title)}</h1>${lead ? `<p>${marked(lead)}</p>` : ""}</header>`;
  const notice = (value) => `<aside class="notice"><span aria-hidden="true">◇</span><p>${escape(value)}</p></aside>`;

  const renderHome = () => {
    const selected = locale.projects.slice(0, 6).map(deckCard).join("");
    return `<div class="page home-page"><section class="hero"><div class="hero-title"><div class="hero-phase" aria-label="Status do projeto"><span class="hero-phase-label">Em construção</span><div class="hero-phase-track" aria-hidden="true"><i></i><i></i><i></i><b></b></div></div><h1>${marked(cleanHeadline(text("home.headline")))}</h1></div><figure class="hero-monogram"><img src="assets/jvk-monogram.png" alt="JVK" /></figure><div class="hero-copy">${locale.home.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}</div></section><section class="section project-deck-section"><div class="section-heading showcase-heading"><h2 class="projects-western">Projetos</h2><a class="text-link" href="#/work">${escape(text("home.allWork"))} ↗</a></div><div class="project-deck-shell"><button class="deck-control deck-prev" type="button" aria-label="Anterior">‹</button><div class="project-deck" data-deck>${selected}</div><button class="deck-control deck-next" type="button" aria-label="Próximo">›</button></div><div class="deck-dots" data-deck-dots aria-hidden="true"></div></section><section class="home-closing"><div><p class="eyebrow">JVK / 2026</p><h2>${escape(text("home.closingTitle"))}</h2><p>${escape(text("home.closingLine"))}</p></div><nav aria-label="${escape(text("mainNav"))}"><a href="#/areas">${escape(text("nav.areas"))}<span>↗</span></a><a href="#/certifications">${escape(text("nav.certifications"))}<span>↗</span></a><a href="#/info">${escape(text("nav.info"))}<span>↗</span></a></nav></section></div>`;
  };

  const renderWork = () => {
    const rows = locale.projects.map((source) => { const item = portfolioProject(source); return `<a class="project-row" href="#/project/${item.id}" data-status="${item.status}"><span class="project-index">${escape(item.id)}</span><h2>${escape(item.title)}</h2><p>${marked(item.summary)}</p><span class="status ${statusClass(item.status)}">${escape(statusText(item.status))}</span><span aria-hidden="true">↗</span></a>`; }).join("");
    return `<div class="page">${pageHeader(text("work.eyebrow"), text("work.title"), text("work.lead"))}<div class="filters" role="group" aria-label="${escape(text("work.filters"))}"><button class="filter is-active" type="button" data-filter="all">${escape(text("work.all"))}</button><button class="filter" type="button" data-filter="AVAILABLE">${escape(text("work.available"))}</button><button class="filter" type="button" data-filter="IN DEVELOPMENT">${escape(text("work.development"))}</button></div><section class="project-list">${rows}</section></div>`;
  };

  const renderProject = (id) => {
    if (id === "01") return renderManagementProject();
    const item = portfolioProject(project(id));
    if (!item) return renderNotFound();
    const demo = item.demo ? `<a class="demo-link" href="${escape(item.demo)}" target="_blank" rel="noopener noreferrer">${escape(text("work.demo"))} &nearr;</a>` : `<p>${escape(text("work.demoPending"))}</p>`;
    const type = item.typeYear ? `<div><span>${escape(text("work.typeYear"))}</span><strong>${marked(item.typeYear)}</strong></div>` : "";
    const overview = item.overview ? `<section><h2>${escape(text("work.overview"))}</h2><p>${marked(item.overview)}</p></section>` : "";
    const capabilities = item.capabilities?.length ? `<section><h2>${escape(text("work.capabilities"))}</h2><ul>${item.capabilities.map((capability) => `<li>${marked(capability)}</li>`).join("")}</ul></section>` : "";
    const technologies = item.technologies?.length ? `<section><h2>${escape(text("work.technologies"))}</h2><ul>${item.technologies.map((technology) => `<li>${marked(technology)}</li>`).join("")}</ul></section>` : "";
    return `<div class="page"><a class="text-link" href="#/work">&larr; ${escape(text("nav.work"))}</a><article class="project-detail"><div><p class="eyebrow">${escape(text("work.eyebrow"))} / ${escape(item.id)}</p><h1>${escape(item.title)}</h1><p class="hero-description">${marked(item.summary)}</p><div class="detail-meta"><div><span>${escape(text("work.status"))}</span><strong class="status ${statusClass(item.status)}">${escape(statusText(item.status))}</strong></div>${type}</div></div><div class="detail-sections">${overview}${capabilities}${technologies}<section><h2>${escape(text("work.demonstration"))}</h2>${demo}</section></div></article></div>`;
  };

  const renderAreas = () => `<div class="page">${pageHeader(text("areas.eyebrow"), text("areas.title"), text("areas.lead"))}<section class="tool-groups section">${locale.areas.groups.map((group) => `<article><h3>${escape(group.title)}</h3><ul>${group.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></article>`).join("")}</section></div>`;
  const renderCertifications = () => `<div class="page">${pageHeader(text("certifications.eyebrow"), text("certifications.title"), text("certifications.lead"))}<section class="certification-grid">${locale.certifications.sections.map((section) => `<article class="empty-state"><h2>${escape(section)}</h2><p>${escape(text("certifications.empty"))}</p></article>`).join("")}</section></div>`;
  const infoIdentityCopy = () => {
    const copies = {
      "pt-BR": {
        title: "- Jvk",
        intro: "Esta, é minha visão.",
        process: "Observar. Entender. Testar. Construir. Ouvir. Decidir.",
        note: "Não importa o quão devagar você vá, desde que não pare.",
        noteSecondary: "Quando o corpo não aguenta, a moral é que sustenta.",
        contact: "Contato"
      }
    };
    return copies[language] || copies["pt-BR"];
  };

  const renderInfo = () => {
    const copy = infoIdentityCopy();
    const contacts = locale.contact.items.map((item) => {
      const target = item.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="journey-contact-link" href="${escape(item.href)}"${target}><span>${escape(item.label)}</span><strong>${escape(item.value)}</strong><small aria-hidden="true">↗</small></a>`;
    }).join("");
    return `<div class="info-journey-page"><section class="journey-stage" aria-labelledby="journey-title"><div class="journey-photo" aria-hidden="true"></div><div class="journey-wash" aria-hidden="true"></div><svg class="journey-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="journey-route-halo" d="M 12 18 C 31 13, 40 20, 48 29 S 60 39, 72 34 C 82 32, 82 48, 68 51 C 55 55, 39 52, 26 58 C 12 64, 18 72, 32 73 C 47 76, 57 79, 70 67 C 80 59, 84 76, 73 85 C 57 94, 34 92, 16 94" /><path class="journey-route-path" pathLength="1" d="M 12 18 C 31 13, 40 20, 48 29 S 60 39, 72 34 C 82 32, 82 48, 68 51 C 55 55, 39 52, 26 58 C 12 64, 18 72, 32 73 C 47 76, 57 79, 70 67 C 80 59, 84 76, 73 85 C 57 94, 34 92, 16 94" /></svg><header class="journey-hero"><p class="journey-index">01 — A origem</p><h1 id="journey-title">${escape(copy.title)}</h1><p>${escape(copy.intro)}</p></header><article class="journey-stop journey-stop--one"><span class="journey-marker">02</span><p>${escape(copy.note)}</p></article><article class="journey-stop journey-stop--two"><span class="journey-marker">03</span><p>${escape(copy.noteSecondary)}</p></article><article class="journey-stop journey-stop--three"><span class="journey-marker">04</span><p>${escape(copy.process)}</p></article><section class="journey-contact"><div><p class="journey-index">05 — Conexão</p><h2>${escape(copy.contact)}</h2></div><div class="journey-contact-links">${contacts}</div></section><a class="journey-photo-credit" href="https://unsplash.com/s/photos/mountain-trail" target="_blank" rel="noopener noreferrer">Fotografia de montanha / Unsplash <span aria-hidden="true">↗</span></a></section></div>`;
  };

  const renderContact = renderInfo;
  const renderLegal = () => `<div class="page">${pageHeader(text("legal.eyebrow"), text("legal.title"))}<section class="legal-stack">${locale.legal.paragraphs.map((paragraph) => `<article class="legal-card"><p>${escape(paragraph)}</p></article>`).join("")}</section></div>`;
  const renderNotFound = () => `<div class="page">${pageHeader("404", text("notFound.title"))}<a class="demo-link" href="#/">${escape(text("notFound.back"))}</a></div>`;

  const bindDeck = () => {
    const deck = document.querySelector("[data-deck]");
    if (!deck) return;
    const cards = [...deck.querySelectorAll(".project-deck-card")];
    const dotsHost = document.querySelector("[data-deck-dots]");
    let active = 0;
    const wrap = (index) => (index + cards.length) % cards.length;
    const dots = cards.map((_, index) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => { active = index; paint(); });
      dotsHost?.append(dot);
      return dot;
    });
    const paint = () => {
      cards.forEach((card, index) => {
        let delta = index - active;
        if (delta > cards.length / 2) delta -= cards.length;
        if (delta < -cards.length / 2) delta += cards.length;
        card.dataset.deckPos = Math.max(-3, Math.min(3, delta));
        card.classList.toggle("is-active", delta === 0);
      });
      dots.forEach((dot,index) => dot.classList.toggle("is-active", index === active));
    };
    document.querySelector(".deck-prev")?.addEventListener("click", () => { active = wrap(active - 1); paint(); });
    document.querySelector(".deck-next")?.addEventListener("click", () => { active = wrap(active + 1); paint(); });
    cards.forEach((card,index) => {
      const activate = () => {
        if (index === active) {
          const item = portfolioProject(locale.projects[index]);
          location.hash = `#/project/${item.id}`;
          return;
        }
        active = index; paint();
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
    });
    paint();
  };

  const bindManagementCatalog = () => {
    const row = document.querySelector(".mg-catalog-row");
    if (!row) return;
    const cards = [...row.querySelectorAll(".mg-catalog-card")];
    cards.forEach((card) => {
      const focus = () => { row.classList.add("is-focusing"); card.classList.add("is-focused"); };
      const blur = () => { card.classList.remove("is-focused"); if (!row.querySelector(".is-focused")) row.classList.remove("is-focusing"); };
      card.addEventListener("mouseenter", focus);
      card.addEventListener("mouseleave", blur);
      card.addEventListener("focus", focus);
      card.addEventListener("blur", blur);
    });
  };

  const bindNavLens = () => {};

  const route = () => location.hash.replace(/^#/, "") || "/";
  const render = () => {
    const current = route();
    const id = current.match(/^\/project\/(\d+)$/)?.[1];
    document.body.dataset.view = current === "/" ? "home" : id ? "project" : current.slice(1) || "home";
    document.body.classList.toggle("management-project-view", id === "01");
    document.body.classList.toggle("info-identity-view", current === "/info" || current === "/contact");
    main.innerHTML = current === "/" ? renderHome() : current === "/work" ? renderWork() : current === "/areas" ? renderAreas() : current === "/certifications" ? renderCertifications() : current === "/info" ? renderInfo() : current === "/contact" ? renderInfo() : current === "/legal" ? renderLegal() : id ? renderProject(id) : renderNotFound();
    document.querySelectorAll("[data-route]").forEach((link) => link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`));
    bindDeck();
    bindManagementCatalog();
    bindNavLens();
  };

  const closeLanguageMenu = () => { languageMenu.hidden = true; languageToggle.setAttribute("aria-expanded", "false"); };
  const closeNavigation = () => { nav.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); closeLanguageMenu(); };
  const applyStaticText = () => {
    document.documentElement.lang = language;
    document.title = text("meta.title");
    document.querySelector('meta[name="description"]').setAttribute("content", text("meta.description"));
    document.querySelector('meta[property="og:title"]').setAttribute("content", text("meta.title"));
    document.querySelector('meta[property="og:description"]').setAttribute("content", text("meta.description"));
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = text(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", text(node.dataset.i18nAria)); });
    languageLabel.textContent = language === "pt-BR" ? "PT" : language.toUpperCase();
  };

  const loadLanguage = async (selected, { persist = false, animateIntro = false } = {}) => {
    if (!supported.includes(selected)) return;
    const encodedLocale = window.JVKLocaleBase64?.[selected];
    if (!encodedLocale) throw new Error("Locale unavailable");
    const bytes = Uint8Array.from(atob(encodedLocale), (character) => character.charCodeAt(0));
    locale = JSON.parse(new TextDecoder("utf-8").decode(bytes)); language = selected;
    const projectOverrides = window.JVK_SITE_CONFIG?.projectOverrides;
    if (projectOverrides) {
      const removed = new Set(projectOverrides.removeIds || []);
      locale.projects = locale.projects.filter((item) => !removed.has(item.id));
      locale.projects.push(...(projectOverrides.addByLocale?.[selected] || []));
    }
    if (persist) localStorage.setItem(storageKey, selected);
    applyStaticText(); render(); closeNavigation();
    closeLanguageMenu();
    if (animateIntro && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      modal.classList.add("is-leaving");
      window.setTimeout(() => {
        modal.setAttribute("aria-hidden", "true");
        modal.classList.remove("is-leaving");
        document.body.classList.remove("intro-open");
      }, 720);
    } else {
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("intro-open");
    }
  };

  const setupIntroEnter = () => {
    const button = modal.querySelector(".enter-button");
    const word = modal.querySelector(".enter-button-word");
    if (!button || !word) return;
    const unlock = () => {
      if (!button.disabled) return;
      button.disabled = false;
      button.classList.remove("is-typing");
      button.classList.add("is-ready");
      button.setAttribute("aria-label", "Entrar no portfólio");
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { unlock(); return; }
    const fallback = window.setTimeout(unlock, 3200);
    word.addEventListener("animationend", (event) => {
      if (event.animationName !== "enter-typewriter") return;
      window.clearTimeout(fallback);
      unlock();
    });
  };

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-language]");
    if (languageButton) {
      if (languageButton.disabled) return;
      const isIntro = Boolean(languageButton.closest("#language-modal"));
      loadLanguage(languageButton.dataset.language, { persist: true, animateIntro: isIntro }).catch(() => { main.innerHTML = "<div class='page'></div>"; });
      return;
    }
    if (event.target.closest(".menu-toggle")) { const opening = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", opening); menuToggle.setAttribute("aria-expanded", String(opening)); return; }
    if (event.target.closest(".language-toggle")) { const opening = languageMenu.hidden; languageMenu.hidden = !opening; languageToggle.setAttribute("aria-expanded", String(opening)); return; }
    const filter = event.target.closest("[data-filter]");
    if (filter) { document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("is-active", button === filter)); document.querySelectorAll(".project-row").forEach((row) => { row.hidden = filter.dataset.filter !== "all" && row.dataset.status !== filter.dataset.filter; }); return; }
    if (event.target.closest(".site-navigation a")) { closeNavigation(); return; }
    if (!event.target.closest(".language-toggle, #language-menu")) closeLanguageMenu();
  });
  window.addEventListener("hashchange", () => { render(); main.focus({ preventScroll: true }); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeNavigation(); });

  if (window.matchMedia("(pointer: fine)").matches) {
    modal.addEventListener("pointermove", (event) => {
      modal.style.setProperty("--intro-x", `${(event.clientX / window.innerWidth) * 100}%`);
      modal.style.setProperty("--intro-y", `${(event.clientY / window.innerHeight) * 100}%`);
    });
  }

  document.body.classList.add("intro-open");
  modal.setAttribute("aria-hidden", "false");
  setupIntroEnter();

})();
