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
  let revealController = null;

  const escape = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const marked = (value) => escape(value);
  const cleanHeadline = (value) => String(value ?? "").replace(/^(Opa|Hola|Hey)\.\s*/i, "");
  const text = (path) => path.split(".").reduce((value, key) => value?.[key], locale) ?? "";
  const project = (id) => locale.projects.find((item) => item.id === id);
  const portfolioProject = (item) => item;
  const statusClass = (status) => status === "AVAILABLE" ? "available" : "";
  const statusText = (status) => status === "AVAILABLE" ? text("work.available") : status === "COMPLETED" ? "Projeto realizado" : text("work.development");

  const showcasePreview = (item) => {
    const visual = window.JVK_SITE_CONFIG?.projectPresentation?.[item.id]?.visual || "management";
    const previews = {
      management: `<div class="preview-ui preview-management"><div class="preview-sidebar"><i></i><i></i><i></i><i></i><i></i></div><div class="preview-main"><div class="preview-top"><span></span><span></span></div><div class="preview-metrics"><b></b><b></b><b></b></div><div class="preview-chart"><svg viewBox="0 0 320 100" preserveAspectRatio="none"><polyline points="0,75 45,64 92,68 138,41 181,52 226,31 270,38 320,19"/></svg></div><div class="preview-row"><span></span><span></span></div></div></div>`,
      portal: `<div class="preview-ui preview-portal"><div class="portal-bar"><span></span><i></i><i></i><i></i></div><div class="portal-copy"><strong></strong><span></span><span></span></div><div class="portal-search"><i></i><span></span><b></b></div><div class="portal-cards"><span></span><span></span><span></span></div><div class="portal-cut"></div></div>`,
      authorflow: `<div class="preview-ui preview-authorflow"><div class="author-controls"><span></span><span></span><span></span><span></span></div><div class="author-doc"><i></i><i></i><i></i><i></i><i></i><b></b></div><div class="author-form"><span></span><span></span><span></span><span></span><span></span></div></div>`,
      map: `<div class="preview-ui preview-map"><svg class="map-lines" viewBox="0 0 360 220" preserveAspectRatio="none"><path d="M-10 185 L62 142 L117 158 L169 101 L224 119 L278 64 L370 82"/><path d="M7 36 L74 68 L129 51 L181 78 L239 41 L303 59 L372 22"/><path d="M62 142 L74 68 M117 158 L129 51 M169 101 L181 78 M224 119 L239 41 M278 64 L303 59"/></svg><div class="map-layers"><b></b><span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div><div class="map-points"><i style="--x:68%;--y:28%"></i><i style="--x:52%;--y:54%"></i><i style="--x:78%;--y:66%"></i><i style="--x:35%;--y:38%"></i><i style="--x:60%;--y:80%"></i></div><div class="map-zoom"><span></span><span></span></div></div>`,
      pulse: `<div class="preview-ui preview-pulse"><div class="pulse-head"><span></span><i></i></div><div class="pulse-metrics"><b></b><b></b><b></b></div><div class="pulse-bars"><i style="--h:44%"></i><i style="--h:68%"></i><i style="--h:39%"></i><i style="--h:82%"></i><i style="--h:56%"></i><i style="--h:73%"></i><i style="--h:48%"></i></div><div class="pulse-axis"><span></span><span></span><span></span><span></span></div></div>`,
      logistics: `<div class="preview-ui preview-logistics"><span></span><span></span><span></span><span></span><span></span></div>`
    };
    return previews[visual] || previews.management;
  };

  const deckCard = (source, index) => {
    const item = portfolioProject(source);
    return `<article class="project-deck-card" data-deck-index="${index}" tabindex="0" role="button" aria-label="${escape(item.title)}"><div class="deck-card-preview" aria-hidden="true">${showcasePreview(item)}</div><div class="deck-card-copy"><h3>${escape(item.title)}</h3><span class="deck-open">${escape(text("work.view"))} ↗</span></div></article>`;
  };

  const pageHeader = (eyebrow, title, lead) => `<header class="page-header"><p class="eyebrow">${escape(eyebrow)}</p><h1 class="page-title">${marked(title)}</h1>${lead ? `<p>${marked(lead)}</p>` : ""}</header>`;
  const notice = (value) => `<aside class="notice"><span aria-hidden="true">◇</span><p>${escape(value)}</p></aside>`;

  const renderHome = () => {
    const selected = locale.projects.map(deckCard).join("");
    return `<div class="page home-page"><section class="hero"><div class="hero-title"><div class="hero-phase" aria-label="Status do projeto"><span class="hero-phase-label">Em construção</span><div class="hero-phase-track" aria-hidden="true"><i></i><i></i><i></i><b></b></div></div><h1>${marked(cleanHeadline(text("home.headline")))}</h1></div><figure class="hero-monogram"><img src="assets/jvk-monogram.png" alt="JVK" /></figure><div class="hero-copy">${locale.home.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}</div></section><section class="section project-deck-section"><div class="section-heading showcase-heading"><h2 class="projects-western">Projetos</h2><a class="text-link" href="#/work">${escape(text("home.allWork"))} ↗</a></div><div class="project-deck-shell"><button class="deck-control deck-prev" type="button" aria-label="Anterior">‹</button><div class="project-deck" data-deck>${selected}</div><button class="deck-control deck-next" type="button" aria-label="Próximo">›</button></div><div class="deck-dots" data-deck-dots aria-hidden="true"></div></section><section class="home-closing"><div><p class="eyebrow">JVK / 2026</p><h2>${escape(text("home.closingTitle"))}</h2><p>${escape(text("home.closingLine"))}</p></div><nav aria-label="${escape(text("mainNav"))}"><a href="#/areas">${escape(text("nav.areas"))}<span>↗</span></a><a href="#/certifications">${escape(text("nav.certifications"))}<span>↗</span></a><a href="#/info">${escape(text("nav.info"))}<span>↗</span></a></nav></section></div>`;
  };

  const renderWork = () => {
    const nodes = locale.projects.map((item, index) => `<a class="orbit-node orbit-node--${index + 1}" data-orbit-index="${index}" href="#/project/${item.id}" aria-label="${escape(item.title)}"><span>${escape(item.title)}</span></a>`).join("");
    const focus = locale.projects.map((item, index) => `<div class="orbit-focus-pane" data-orbit-pane="${index}" hidden><h2>${escape(item.title)}</h2><p>${escape(item.summary)}</p><a href="#/project/${item.id}">Explorar projeto <span aria-hidden="true">↗</span></a></div>`).join("");
    return `<div class="page work-exploration-page"><header class="work-heading"><p class="eyebrow">Projetos</p><h1>Projetos</h1><p>Seis ideias para explorar, cada uma com sua própria história.</p></header><section class="work-orbit" data-work-orbit aria-label="Explorar projetos"><div class="orbit-field">${nodes}<div class="orbit-focus" aria-live="polite"><div class="orbit-focus-idle"><span>Explore um projeto</span></div>${focus}</div></div></section></div>`;
  };

  const projectArtwork = (id) => {
    const art = {
      "01": `<div class="story-visual story-visual--management" aria-hidden="true"><span>Registros</span><span>Agenda</span><span>Consultas</span><span>Perfis de acesso</span></div>`,
      "02": `<div class="story-visual story-visual--portal" aria-hidden="true"><span>Perguntas</span><span>Respostas</span><i></i><i></i><i></i></div>`,
      "03": `<div class="story-visual story-visual--documents" aria-hidden="true"><div class="document-sheet document-sheet--input"><i></i><i></i><i></i><i></i></div><div class="document-sheet document-sheet--preview"><i></i><i></i><i></i><i></i><i></i></div></div>`,
      "04": `<div class="story-visual story-visual--map" aria-hidden="true"><svg viewBox="0 0 640 440" preserveAspectRatio="xMidYMid meet"><path class="map-contour" d="M-25 105C75 12 156 54 218 113S376 177 451 77 598 40 670 84M-20 158C73 66 155 104 217 163S376 230 452 127 597 91 668 133M-20 212C73 119 155 157 217 216S376 283 452 181 597 145 668 187M-20 265C73 172 155 210 217 269S376 336 452 234 597 198 668 240M-20 318C73 225 155 263 217 322S376 389 452 287 597 251 668 293"/><path class="map-parcel" d="M85 132L224 85 332 154 277 307 126 327Z M332 154L471 113 534 236 445 361 277 307Z"/></svg></div>`,
      "05": `<div class="story-visual story-visual--pulse" aria-hidden="true">${[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n) => `<i style="--event:${n}"></i>`).join("")}</div>`,
      "06": `<div class="story-visual story-visual--logistics" aria-hidden="true"><span>Entrada</span><span>Registro</span><span>Movimentação</span><span>Saída</span></div>`
    };
    return art[id] || "";
  };

  const renderProject = (id) => {
    const item = project(id);
    if (!item) return renderNotFound();
    const index = locale.projects.findIndex((entry) => entry.id === id);
    const previous = locale.projects[(index - 1 + locale.projects.length) % locale.projects.length];
    const next = locale.projects[(index + 1) % locale.projects.length];
    const chapters = [
      ["Origem", item.story?.[0]],
      ["Necessidade", item.problem, item.story?.[1]],
      ["Evolução", item.story?.[2], item.development]
    ].map(([heading, ...paragraphs], chapter) => `<section class="project-chapter project-chapter--${chapter + 1}" data-project-reveal><h2>${heading}</h2><div>${paragraphs.filter(Boolean).map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}</div></section>`).join("");
    const capabilities = item.capabilities?.length ? `<section class="project-facts" data-project-reveal><h2>${escape(item.capabilitiesLabel || "Elementos principais")}</h2><ul>${item.capabilities.map((entry) => `<li>${escape(entry)}</li>`).join("")}</ul></section>` : "";
    const technologies = item.technologies?.length ? `<section class="project-facts" data-project-reveal><h2>Tecnologias</h2><p>${item.technologies.map(escape).join(" · ")}</p></section>` : "";
    return `<div class="project-story-page project-story-page--${id}" data-project-story><article><header class="project-opening"><a class="project-back" href="#/work">← Projetos</a><div class="project-opening-copy"><p class="project-opening-index">${escape(item.id)} / ${escape(statusText(item.status))}</p><h1>${escape(item.title)}</h1><p>${escape(item.summary)}</p></div>${projectArtwork(id)}</header><div class="project-narrative">${chapters}</div><div class="project-afterword">${capabilities}${technologies}<section class="project-facts" data-project-reveal><h2>Status</h2><p>${escape(statusText(item.status))}</p></section></div><nav class="project-neighbors" aria-label="Outros projetos"><a href="#/project/${previous.id}"><span>Projeto anterior</span><strong>${escape(previous.title)}</strong></a><a href="#/project/${next.id}"><span>Próximo projeto</span><strong>${escape(next.title)}</strong></a></nav></article></div>`;
  };

  const areaDockLabels = ["Web", "Dados", "Infra", "Auto", "Geo", "Design", "Gestão", "Git"];
  const renderAreas = () => `<div class="page areas-experience-page"><header class="experience-heading"><h1 class="page-title">${escape(text("areas.title"))}</h1><p>${escape(text("areas.lead"))}</p></header><section class="area-stage" aria-label="${escape(text("areas.title"))}"><div class="area-stage-panels">${locale.areas.groups.map((group, index) => `<div class="area-scene area-scene--${index + 1}${index === 0 ? " is-active" : ""}" id="area-panel-${index}" role="tabpanel" aria-labelledby="area-tab-${index}" tabindex="0"${index ? " hidden" : ""}><h2>${escape(group.title)}</h2><ul>${group.items.map((item, itemIndex) => `<li style="--tool-order:${itemIndex}">${escape(item)}</li>`).join("")}</ul></div>`).join("")}</div><nav class="area-dock" role="tablist" aria-label="${escape(text("areas.title"))}">${locale.areas.groups.map((group, index) => `<button type="button" role="tab" class="area-dock-tab${index === 0 ? " is-active" : ""}" id="area-tab-${index}" aria-controls="area-panel-${index}" aria-selected="${index === 0}" aria-label="${escape(group.title)}" tabindex="${index === 0 ? "0" : "-1"}" data-area-index="${index}"><span aria-hidden="true">${escape(areaDockLabels[index] || group.title)}</span></button>`).join("")}</nav></section></div>`;
  const renderCertifications = () => {
    const entries = locale.certifications.items.map((item, index) => {
      const body = `${item.description ? `<p>${escape(item.description)}</p>` : ""}${item.contents?.length ? `<ul>${item.contents.map((entry) => `<li>${escape(entry)}</li>`).join("")}</ul>` : ""}`;
      const media = item.media?.src ? `<figure class="archive-media"><img src="${escape(item.media.src)}" alt="${escape(item.media.alt || item.title)}" /></figure>` : "";
      const hasDetail = Boolean(body || media);
      const control = hasDetail ? ` aria-expanded="${index === 0}" aria-controls="archive-detail-${index}"` : "";
      const detail = hasDetail ? `<div class="archive-detail" id="archive-detail-${index}"${index === 0 ? "" : " hidden"}><div class="archive-copy">${body}</div>${media}</div>` : "";
      return `<article class="archive-item${index === 0 ? " is-current is-expanded" : ""}" data-cert-index="${index}"><h2><button type="button" class="archive-select"${control} data-cert-select="${index}">${item.period ? `<span class="archive-period">${escape(item.period)}</span>` : ""}<span class="archive-title">${escape(item.title)}</span><span class="archive-institution">${escape(item.institution)}</span></button></h2>${detail}</article>`;
    }).join("");
    return `<div class="page certifications-experience-page"><header class="experience-heading"><h1 class="page-title">${escape(text("certifications.title"))}</h1><p>${escape(text("certifications.lead"))}</p></header><section class="cert-archive" aria-label="${escape(text("certifications.title"))}">${entries}</section></div>`;
  };
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
    const profile = locale.info.profile;
    return `<div class="info-journey-page"><section class="journey-stage" aria-labelledby="journey-title"><div class="journey-photo" aria-hidden="true"></div><div class="journey-wash" aria-hidden="true"></div><svg class="journey-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="journey-route-halo" d="M 12 18 C 31 13, 40 20, 48 29 S 60 39, 72 34 C 82 32, 82 48, 68 51 C 55 55, 39 52, 26 58 C 12 64, 18 72, 32 73 C 47 76, 57 79, 70 67 C 80 59, 84 76, 73 85 C 57 94, 34 92, 16 94" /><path class="journey-route-path" pathLength="1" d="M 12 18 C 31 13, 40 20, 48 29 S 60 39, 72 34 C 82 32, 82 48, 68 51 C 55 55, 39 52, 26 58 C 12 64, 18 72, 32 73 C 47 76, 57 79, 70 67 C 80 59, 84 76, 73 85 C 57 94, 34 92, 16 94" /></svg><header class="journey-hero"><p class="journey-index">01 — A origem</p><h1 id="journey-title">${escape(copy.title)}</h1><p>${escape(copy.intro)}</p></header><article class="journey-stop journey-stop--one"><span class="journey-marker">02</span><p>${escape(copy.note)}</p></article><article class="journey-stop journey-stop--two"><span class="journey-marker">03</span><p>${escape(copy.noteSecondary)}</p></article><article class="journey-stop journey-stop--three"><span class="journey-marker">04</span><p>${escape(copy.process)}</p></article><section class="journey-contact"><div><p class="journey-index">05 — Conexão</p><h2>${escape(copy.contact)}</h2></div><div class="journey-contact-links">${contacts}</div></section><a class="journey-photo-credit" href="https://unsplash.com/s/photos/mountain-trail" target="_blank" rel="noopener noreferrer">Fotografia de montanha / Unsplash <span aria-hidden="true">↗</span></a></section><section class="professional-profile"><h2>Perfil profissional</h2><p>${escape(profile.summary)}</p><h2>Experiência</h2>${profile.experience.map((item) => `<article><h3>${escape(item.role)}</h3><p class="certification-meta">${escape(item.organization)} · ${escape(item.period)}</p>${item.description ? `<p>${escape(item.description)}</p>` : ""}</article>`).join("")}<h2>Formação</h2>${profile.education.map((item) => `<p><strong>${escape(item.title)}</strong> — ${escape(item.institution)}, ${escape(item.period)} (${escape(item.status)})</p>`).join("")}<h2>Idiomas</h2><p>${profile.languages.map((item) => `${escape(item.name)} — ${escape(item.level)}`).join(" · ")}</p></section></div>`;
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

  const bindWorkOrbit = () => {
    const orbit = document.querySelector("[data-work-orbit]");
    if (!orbit) return;
    revealController = new AbortController();
    const nodes = [...orbit.querySelectorAll("[data-orbit-index]")];
    const panes = [...orbit.querySelectorAll("[data-orbit-pane]")];
    const idle = orbit.querySelector(".orbit-focus-idle");
    const mobile = () => window.innerWidth <= 760;
    let active = -1;
    let pointerStart = null;
    let touchedInactive = false;
    let swiped = false;
    let pending = false;
    const select = (index) => {
      if (index === active) return;
      active = index;
      orbit.classList.toggle("has-focus", index >= 0);
      idle.hidden = index >= 0;
      nodes.forEach((node, position) => {
        node.classList.toggle("is-active", position === index);
        let delta = (position - index + nodes.length) % nodes.length;
        if (delta > nodes.length / 2) delta -= nodes.length;
        node.dataset.mobilePos = String(delta);
      });
      panes.forEach((pane, position) => { pane.hidden = position !== index; });
    };
    nodes.forEach((node, index) => {
      node.addEventListener("focus", () => select(index));
      node.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch" || mobile()) touchedInactive = active !== index;
      });
      node.addEventListener("click", (event) => {
        if (swiped) event.preventDefault();
        else if (mobile() && touchedInactive) {
          event.preventDefault();
          select(index);
        }
        touchedInactive = false;
        swiped = false;
      });
    });
    orbit.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") pointerStart = event.clientX;
    });
    orbit.addEventListener("pointerup", (event) => {
      if (pointerStart === null || !mobile()) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) < 45) return;
      swiped = true;
      select((active + (distance < 0 ? 1 : -1) + nodes.length) % nodes.length);
    });
    orbit.addEventListener("pointercancel", () => {
      pointerStart = null;
      touchedInactive = false;
      swiped = false;
    });
    orbit.addEventListener("pointermove", (event) => {
      if (mobile() || event.pointerType === "touch" || pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const nearest = nodes.reduce((best, node, index) => {
          const rect = node.getBoundingClientRect();
          const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
          const strength = Math.max(0, 1 - distance / 250);
          node.style.setProperty("--orbit-scale", (1 + strength * .08).toFixed(3));
          node.style.setProperty("--orbit-alpha", (.64 + strength * .36).toFixed(3));
          return distance < best.distance ? { index, distance } : best;
        }, { index: -1, distance: Infinity });
        if (nearest.distance < 220) select(nearest.index);
      });
    });
    orbit.addEventListener("pointerleave", () => {
      nodes.forEach((node) => { node.style.removeProperty("--orbit-scale"); node.style.removeProperty("--orbit-alpha"); });
      if (!mobile() && !orbit.matches(":focus-within")) select(-1);
    });
    if (mobile()) select(0);
    window.addEventListener("resize", () => {
      if (mobile() && active < 0) select(0);
      else if (!mobile() && !orbit.matches(":focus-within")) select(-1);
    }, { signal: revealController.signal });
  };

  const bindProjectStory = () => {
    const story = document.querySelector("[data-project-story]");
    if (!story) return;
    const sections = [...story.querySelectorAll("[data-project-reveal]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealController = new AbortController();
    if (reduced || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    story.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .08, rootMargin: "0px 0px -8% 0px" });
    sections.forEach((section) => observer.observe(section));
    revealController.signal.addEventListener("abort", () => observer.disconnect(), { once: true });
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = story.getBoundingClientRect();
        const range = Math.max(1, rect.height - innerHeight);
        story.style.setProperty("--story-progress", Math.max(0, Math.min(1, -rect.top / range)).toFixed(3));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true, signal: revealController.signal });
    onScroll();
  };

  const bindNavLens = () => {};

  const bindAreaExperience = () => {
    const tabs = [...document.querySelectorAll("[data-area-index]")];
    const panels = [...document.querySelectorAll(".area-scene")];
    const stage = document.querySelector(".area-stage-panels");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = 0;
    let pending;
    const select = (index, focus = false) => {
      if (index === active || index < 0 || index >= tabs.length) return;
      window.clearTimeout(pending);
      active = index;
      tabs.forEach((tab, position) => {
        const selected = position === index;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      if (focus) tabs[index].focus();
      const dock = tabs[index].parentElement;
      dock.scrollTo({ left: tabs[index].offsetLeft - (dock.clientWidth - tabs[index].clientWidth) / 2, behavior: reduced.matches ? "instant" : "smooth" });
      stage.classList.add("is-changing");
      const reveal = () => {
        panels.forEach((panel, position) => {
          if (position === index) return;
          panel.hidden = true;
          panel.classList.remove("is-active");
        });
        panels[index].hidden = false;
        panels[index].classList.remove("is-active");
        void panels[index].offsetWidth;
        panels[index].classList.add("is-active");
        stage.classList.remove("is-changing");
      };
      if (reduced.matches) reveal();
      else pending = window.setTimeout(reveal, 115);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", (event) => {
        const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });
  };

  const bindCertificationExperience = () => {
    const items = [...document.querySelectorAll("[data-cert-index]")];
    let expanded = 0;
    const setCurrent = (index) => items.forEach((item, position) => {
      item.classList.toggle("is-current", index === position);
      item.classList.toggle("is-past", position < index);
      item.classList.toggle("is-future", position > index);
    });
    const expand = (index) => {
      expanded = index;
      items.forEach((item, position) => {
        const selected = position === index;
        item.classList.toggle("is-expanded", selected);
        const button = item.querySelector(".archive-select");
        const detail = item.querySelector(".archive-detail");
        if (detail) {
          button.setAttribute("aria-expanded", String(selected));
          detail.hidden = !selected;
        }
      });
      setCurrent(index);
    };
    items.forEach((item, index) => {
      item.querySelector(".archive-select").addEventListener("click", () => expand(index));
      item.addEventListener("focusin", () => setCurrent(index));
    });
    revealController = new AbortController();
    let pending = false;
    const trackScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const target = window.innerHeight * .42;
        const nearest = items.reduce((best, item, index) => {
          const distance = Math.abs(item.getBoundingClientRect().top - target);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        setCurrent(nearest.index);
      });
    };
    window.addEventListener("scroll", trackScroll, { passive: true, signal: revealController.signal });
    window.addEventListener("resize", trackScroll, { passive: true, signal: revealController.signal });
    trackScroll();
  };

  const route = () => location.hash.replace(/^#/, "") || "/";
  const render = () => {
    revealController?.abort();
    revealController = null;
    const current = route();
    const id = current.match(/^\/project\/(\d+)$/)?.[1];
    document.body.dataset.view = current === "/" ? "home" : id ? "project" : current.slice(1) || "home";
    document.body.classList.remove("management-project-view");
    document.body.classList.toggle("info-identity-view", current === "/info" || current === "/contact");
    main.innerHTML = current === "/" ? renderHome() : current === "/work" ? renderWork() : current === "/areas" ? renderAreas() : current === "/certifications" ? renderCertifications() : current === "/info" ? renderInfo() : current === "/contact" ? renderInfo() : current === "/legal" ? renderLegal() : id ? renderProject(id) : renderNotFound();
    document.querySelectorAll("[data-route]").forEach((link) => link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`));
    bindDeck();
    bindNavLens();
    if (current === "/work") bindWorkOrbit();
    if (id) bindProjectStory();
    if (current === "/areas") bindAreaExperience();
    if (current === "/certifications") bindCertificationExperience();
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
    if (selected === "pt-BR" && window.JVKProjectData?.length === 6) locale.projects = window.JVKProjectData;
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
    if (event.target.closest(".site-navigation a")) { closeNavigation(); return; }
    if (!event.target.closest(".language-toggle, #language-menu")) closeLanguageMenu();
  });
  window.addEventListener("hashchange", () => {
    render();
    if (route() === "/areas" || route() === "/certifications" || route() === "/work" || route().startsWith("/project/")) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

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
