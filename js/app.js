(() => {
  const supported = ["pt-BR"];
  const storageKey = "jvkportfolio-language";
  const main = document.querySelector("#main-content");
  const nav = document.querySelector("#site-navigation");
  const menuToggle = document.querySelector(".menu-toggle");
  const languageToggle = document.querySelector(".language-toggle");
  const languageMenu = document.querySelector("#language-menu");
  const languageLabel = document.querySelector("#current-language");
  let locale = null;
  let language = null;
  let revealController = null;
  let heroTypewriterCleanup = null;
  let heroBuildCleanup = null;
  let heroBuildPending = (location.hash.replace(/^#/, "") || "/") === "/";

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

  const homeProjectEntry = (item, index) => `<a class="home-project-row${index === 0 ? " is-active" : ""}" data-home-project-row="${index}" href="#/project/${escape(item.id)}"><strong>${escape(item.title)}</strong><p>${escape(item.summary)}</p><small>Ver projeto</small></a>`;
  const homeProjectPreview = (item, index) => `<figure class="home-project-preview${index === 0 ? " is-active" : ""}" data-home-project-preview="${index}" aria-hidden="true">${showcasePreview(item)}</figure>`;

  const heroMonogram = (build) => {
    if (!build) return `<img src="assets/jvk-hero-floating.png" alt="" />`;
    const track = (name, path, width, duration, delay, finish = false) =>
      `<path class="hero-build-track hero-build-${name}" d="${path}" pathLength="1" stroke-width="${width}" style="--build-duration:${duration}s;--build-delay:${delay}s"${finish ? ' data-logo-finish=""' : ""} />`;
    return `<svg class="hero-build-svg" viewBox="0 0 1774 887" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs><mask id="hero-build-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1774" height="887">
        ${track("j-top-left", "M565 173 L849 173", 104, 1.92, 0)}
        ${track("j-top-right", "M894 173 L791 173", 104, 1.72, .04)}
        ${track("j-stem", "M830 146 L830 539", 128, 2.15, .08)}
        ${track("j-curve", "M596 485 C587 568 639 624 717 625 C789 627 846 594 872 551", 170, 2.3, .02)}
        ${track("k-stem-top", "M1121 121 L1121 487", 154, 2.2, .08)}
        ${track("k-stem-bottom", "M1121 710 L1121 450", 154, 2.26, .09)}
        ${track("k-arm-top", "M1515 205 L1177 481", 178, 2.32, .09)}
        ${track("k-arm-bottom", "M1527 718 L1207 430", 178, 2.34, .1)}
        ${track("v-left", "M797 298 L956 685", 210, 2.43, .14)}
        ${track("v-right", "M1093 130 L1093 351 L956 685", 200, 2.5, .15, true)}
        ${track("shadow", "M582 728 C862 686 1216 688 1540 723", 94, 2.28, .16)}
      </mask></defs>
      <image href="assets/jvk-hero-floating.png" x="0" y="0" width="1774" height="887" mask="url(#hero-build-mask)" />
    </svg>`;
  };

  const renderHome = () => {
    const selected = locale.projects.map(homeProjectEntry).join("");
    const previews = locale.projects.map(homeProjectPreview).join("");
    const build = heroBuildPending && typeof SVGMaskElement !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heroBuildPending = false;
    return `<div class="page home-page"><section class="hero hero-home${build ? " is-logo-building" : ""}" aria-labelledby="home-title"><div class="hero-title"><h1 id="home-title" class="sr-only">JVK</h1><p class="hero-copy" aria-label="Sistemas, dados e tecnologia aplicados a ideias reais."><code class="hero-code" aria-hidden="true"><i class="hero-token hero-token--system" data-typewriter-token="Sistemas,"></i> <i class="hero-token hero-token--data" data-typewriter-token="dados"></i> <i class="hero-token hero-token--join" data-typewriter-token="e"></i> <i class="hero-token hero-token--technology" data-typewriter-token="tecnologia"></i> <i class="hero-token hero-token--action" data-typewriter-token="aplicados"></i> <i class="hero-token hero-token--idea" data-typewriter-token="a ideias reais."></i></code></p><a class="hero-entry" href="#/work">Explorar projetos</a></div><figure class="hero-monogram" aria-hidden="true">${heroMonogram(build)}</figure></section>
      <section class="home-capabilities" aria-labelledby="capabilities-title"><h2 id="capabilities-title">O que eu faço</h2><div class="home-capability-list"><article class="home-capability-row"><h3>Sistemas e automação</h3><div><p>Estruturo registros, rotinas, agenda e perfis de acesso em sistemas conectados a bancos de dados.</p><p class="home-capability-proof">JavaScript · Supabase · SQL · modelagem de dados</p></div></article><article class="home-capability-row"><h3>Dados e informação</h3><div><p>Organizo conteúdo e registros para facilitar consultas e revelar como as atividades se distribuem ao longo do tempo.</p><p class="home-capability-proof">Portal com mais de 1.000 perguntas e respostas · Pulse · Excel · Power BI</p></div></article><article class="home-capability-row"><h3>Processos e operações</h3><div><p>Analiso rotinas, documentos, inspeções e movimentações de materiais para melhorar a organização e o acompanhamento do trabalho.</p><p class="home-capability-proof">Operações regulatórias · logística · controle de materiais</p></div></article><article class="home-capability-row"><h3>Interfaces e documentos</h3><div><p>Desenvolvo interfaces de preenchimento guiado, prévias de documentos durante a edição e estruturas prontas para gerar PDF.</p><p class="home-capability-proof">HTML · CSS · JavaScript · padronização documental</p></div></article><article class="home-capability-row"><h3>Mapas e geotecnologia</h3><div><p>Exploro camadas e dados geográficos para compreender propriedades, território e informações ambientais.</p><p class="home-capability-proof">QGIS · GeoJSON · dados geoespaciais · sensoriamento remoto</p></div></article><article class="home-capability-row"><h3>Suporte e infraestrutura</h3><div><p>Atuo com montagem e manutenção de computadores, suporte técnico, redes e fundamentos de Linux.</p><p class="home-capability-proof">Hardware · redes · Linux · suporte técnico</p></div></article></div></section>
      <section class="home-projects" data-home-projects aria-labelledby="home-projects-title"><div class="home-projects-heading"><h2 id="home-projects-title">Projetos</h2><a href="#/work">Ver todos</a></div><div class="home-projects-layout"><div class="home-project-index">${selected}</div><div class="home-project-stage">${previews}</div></div></section>
      <section class="home-closing"><div class="home-closing-statement"><h2>Entender. Estruturar. Construir.</h2><p>Tecnologia aplicada a problemas reais, com clareza e intenção.</p></div><div class="home-closing-actions"><a href="#/info">Conhecer o JVK</a><a href="mailto:jvkworkstation@gmail.com">Iniciar conversa</a></div><nav aria-label="${escape(text("mainNav"))}"><a href="#/areas">Áreas</a><a href="#/certifications">Certificações</a><a href="#/work">Projetos</a></nav></section></div>`;
  };

  const bindHomeCapabilitySyntax = () => {
    const descriptions = [
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Estruturo</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> registros, rotinas, agenda e perfis de acesso em sistemas <i class="cap-inline-mark" aria-hidden="true">**/</i><em>conectados a bancos de dados</em><i class="cap-inline-mark" aria-hidden="true">/**</i>.`,
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Organizo</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> conteúdo e registros para facilitar consultas e revelar como as <i class="cap-inline-mark" aria-hidden="true">**/</i><em>atividades se distribuem ao longo</em><i class="cap-inline-mark" aria-hidden="true">/**</i> do tempo.`,
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Analiso</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> rotinas, documentos, inspeções e movimentações de materiais para <i class="cap-inline-mark" aria-hidden="true">**/</i><em>melhorar a organização e o acompanhamento do trabalho</em><i class="cap-inline-mark" aria-hidden="true">/**</i>.`,
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Desenvolvo</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> interfaces de <i class="cap-inline-mark" aria-hidden="true">**/</i><em>preenchimento guiado</em><i class="cap-inline-mark" aria-hidden="true">/**</i>, prévias de documentos <i class="cap-inline-mark" aria-hidden="true">**/</i><em>durante a edição</em><i class="cap-inline-mark" aria-hidden="true">/**</i> e estruturas prontas para gerar PDF.`,
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Exploro</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> camadas e dados geográficos para compreender <i class="cap-inline-mark" aria-hidden="true">**/</i><em>propriedades, território e informações ambientais</em><i class="cap-inline-mark" aria-hidden="true">/**</i>.`,
      `<i class="cap-inline-mark" aria-hidden="true">&lt;</i><strong class="cap-inline-verb">Atuo</strong><i class="cap-inline-mark" aria-hidden="true">&gt;</i> com <i class="cap-inline-mark" aria-hidden="true">**/</i><em>montagem e manutenção de computadores</em><i class="cap-inline-mark" aria-hidden="true">/**</i>, suporte técnico, redes e fundamentos de Linux.`
    ];
    const examples = [
      ["JavaScript", "Supabase", "SQL", "modelagem de dados"],
      ["1.000+ perguntas e respostas", "Pulse", "Excel", "Power BI"],
      ["operações regulatórias", "logística", "controle de materiais"],
      ["HTML", "CSS", "JavaScript", "padronização documental"],
      ["QGIS", "GeoJSON", "dados geoespaciais", "sensoriamento remoto"],
      ["hardware", "redes", "Linux", "suporte técnico"]
    ];
    main.querySelectorAll(".home-capability-proof").forEach((node, index) => {
      const description = node.parentElement?.querySelector(":scope > p:first-child");
      if (description) description.innerHTML = descriptions[index] || "";
      node.outerHTML = `<ul class="home-capability-tools" aria-label="Ferramentas e referências">${(examples[index] || []).map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;
    });
  };

  const bindHomeProjects = () => {
    const section = main.querySelector("[data-home-projects]");
    if (!section) return;
    const rows = [...section.querySelectorAll("[data-home-project-row]")];
    const previews = [...section.querySelectorAll("[data-home-project-preview]")];
    const activate = (index) => {
      rows.forEach((row, position) => row.classList.toggle("is-active", position === index));
      previews.forEach((preview, position) => preview.classList.toggle("is-active", position === index));
    };
    rows.forEach((row, index) => {
      row.addEventListener("mouseenter", () => activate(index));
      row.addEventListener("focus", () => activate(index));
    });
  };

  const bindHeroTypewriter = () => {
    const code = main.querySelector(".hero-code");
    if (!code) return null;
    const tokens = [...code.querySelectorAll("[data-typewriter-token]")].map((element) => ({ element, value: element.dataset.typewriterToken }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tokens.forEach(({ element, value }) => { element.textContent = value; });
      code.classList.add("is-static");
      return null;
    }

    tokens.forEach(({ element }) => { element.textContent = ""; });
    let inView = false;
    let started = false;
    let timer = null;
    let pendingStep = null;
    let remaining = 0;
    let dueAt = 0;
    let tokenIndex = 0;
    let charIndex = 0;
    let eraseToken = tokens.length - 1;
    let eraseIndex = 0;
    let observer = null;

    const arm = () => {
      if (!inView || document.hidden || timer !== null || !pendingStep) return;
      dueAt = Date.now() + remaining;
      timer = window.setTimeout(() => {
        timer = null;
        remaining = 0;
        const step = pendingStep;
        pendingStep = null;
        step?.();
      }, remaining);
    };
    const schedule = (step, delay) => {
      pendingStep = step;
      remaining = delay;
      arm();
    };
    const pause = () => {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, dueAt - Date.now());
    };
    const typeNext = () => {
      if (tokenIndex >= tokens.length) {
        schedule(beginErase, 15000);
        return;
      }
      const token = tokens[tokenIndex];
      if (charIndex >= token.value.length) {
        tokenIndex += 1;
        charIndex = 0;
        schedule(typeNext, 28);
        return;
      }
      charIndex += 1;
      token.element.textContent = token.value.slice(0, charIndex);
      const isTechPause = token.value === "tecnologia" && charIndex === 7;
      schedule(typeNext, isTechPause ? 1050 : 46);
    };
    const eraseNext = () => {
      if (eraseToken < 0) {
        tokenIndex = 0;
        charIndex = 0;
        schedule(typeNext, 700);
        return;
      }
      if (eraseIndex <= 0) {
        eraseToken -= 1;
        eraseIndex = eraseToken >= 0 ? tokens[eraseToken].value.length : 0;
        schedule(eraseNext, 24);
        return;
      }
      eraseIndex -= 1;
      tokens[eraseToken].element.textContent = tokens[eraseToken].value.slice(0, eraseIndex);
      schedule(eraseNext, 30);
    };
    function beginErase() {
      eraseToken = tokens.length - 1;
      eraseIndex = tokens[eraseToken]?.element.textContent.length || 0;
      eraseNext();
    }
    const activate = () => {
      if (!inView || document.hidden) { pause(); return; }
      if (stage.classList.contains("is-logo-building")) return;
      if (!started) {
        started = true;
        schedule(typeNext, 350);
      } else arm();
    };
    const onVisibilityChange = () => activate();
    document.addEventListener("visibilitychange", onVisibilityChange);
    const stage = code.closest(".hero-home");
    stage.addEventListener("hero-logo-complete", activate);
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= .2;
        activate();
      }, { threshold: [.2] });
      observer.observe(stage);
    } else {
      inView = true;
      activate();
    }
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stage.removeEventListener("hero-logo-complete", activate);
      if (timer !== null) window.clearTimeout(timer);
    };
  };

  const bindHeroConstruction = () => {
    const stage = main.querySelector(".hero-home.is-logo-building");
    const svg = stage?.querySelector(".hero-build-svg");
    if (!svg) return null;
    const image = svg.querySelector("image");
    const lastTrack = svg.querySelector("[data-logo-finish]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let finished = false;
    let cancelled = false;
    let fallbackTimer = null;
    let loadTimer = null;
    const setCrop = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      const assetAspect = 1774 / 887;
      const position = width <= 760 ? .7 : .5;
      if (aspect < assetAspect) {
        const visibleWidth = 887 * aspect;
        svg.setAttribute("viewBox", `${(1774 - visibleWidth) * position} 0 ${visibleWidth} 887`);
      } else {
        const visibleHeight = 1774 / aspect;
        svg.setAttribute("viewBox", `0 ${(887 - visibleHeight) / 2} 1774 ${visibleHeight}`);
      }
    };
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(loadTimer);
      image.removeAttribute("mask");
      stage.classList.remove("is-logo-building");
      stage.classList.remove("is-logo-running");
      stage.dispatchEvent(new Event("hero-logo-complete"));
    };
    const start = () => {
      if (finished || cancelled) return;
      window.clearTimeout(loadTimer);
      stage.classList.add("is-logo-running");
      fallbackTimer = window.setTimeout(finish, 3300);
    };
    const onAnimationEnd = (event) => { if (event.target === lastTrack) finish(); };
    const onMotionChange = () => { if (motion.matches) finish(); };
    setCrop();
    svg.addEventListener("animationend", onAnimationEnd);
    window.addEventListener("resize", setCrop, { passive: true });
    motion.addEventListener?.("change", onMotionChange);
    const source = new Image();
    source.src = "assets/jvk-hero-floating.png";
    if (source.decode) source.decode().then(start, finish);
    else { source.onload = start; source.onerror = finish; }
    loadTimer = window.setTimeout(finish, 5000);
    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(loadTimer);
      svg.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("resize", setCrop);
      motion.removeEventListener?.("change", onMotionChange);
    };
  };

  const renderWork = () => {
    const first = locale.projects[0];
    const cards = locale.projects.map((item, index) => `<button class="project-gallery-card${index === 0 ? " is-active" : ""}" type="button" data-gallery-index="${index}" aria-pressed="${index === 0}" aria-label="${index === 0 ? "Abrir" : "Selecionar"} projeto ${index + 1}: ${escape(item.title)}"><span class="project-gallery-card-index">${String(index + 1).padStart(2, "0")}</span><span class="project-gallery-card-title">${escape(item.title)}</span><span class="project-gallery-card-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M4 10h11M10 5l5 5-5 5" /></svg></span></button>`).join("");
    return `<div class="page work-exploration-page"><section class="project-gallery" data-project-gallery data-active="0" aria-label="Projetos"><header class="project-gallery-intro"><p class="eyebrow">Explorar</p><h1>Projetos<br>em destaque</h1><span class="project-gallery-prompt" aria-hidden="true"><i>→</i><span>Selecione um projeto</span></span></header><section class="project-gallery-feature" aria-live="polite" aria-atomic="true"><div class="project-gallery-feature-meta"><span>Projeto selecionado</span><span data-gallery-count>01 / 06</span></div><h2 data-gallery-title>${escape(first.title)}</h2><a class="project-gallery-open" data-gallery-open href="#/project/01">Explorar Sistema de Gestão <span aria-hidden="true">↗</span></a><div class="project-gallery-art" aria-hidden="true"><span class="gallery-art-orbit gallery-art-orbit--outer"></span><span class="gallery-art-orbit gallery-art-orbit--inner"></span><span class="gallery-art-core"></span><span class="gallery-art-line gallery-art-line--one"></span><span class="gallery-art-line gallery-art-line--two"></span><span class="gallery-art-glow"></span></div></section><nav class="project-gallery-rail" aria-label="Selecionar projeto">${cards}</nav></section></div>`;
  };

  const bindProjectGallery = () => {
    const gallery = document.querySelector("[data-project-gallery]");
    if (!gallery) return;
    const cards = [...gallery.querySelectorAll("[data-gallery-index]")];
    const title = gallery.querySelector("[data-gallery-title]");
    const count = gallery.querySelector("[data-gallery-count]");
    const open = gallery.querySelector("[data-gallery-open]");
    const select = (index, moveFocus = false) => {
      const item = locale.projects[index];
      if (!item) return;
      gallery.dataset.active = String(index);
      title.textContent = item.title;
      title.classList.remove("is-changing");
      void title.offsetWidth;
      title.classList.add("is-changing");
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      open.hidden = item.id !== "01";
      cards.forEach((card, position) => {
        const active = position === index;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", String(active));
      });
      if (moveFocus) cards[index].focus();
    };
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (locale.projects[index]?.id === "01") {
          location.hash = "#/project/01";
          return;
        }
        select(index);
      });
      card.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % cards.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + cards.length) % cards.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = cards.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });
  };

  const renderLab = () => {
    const labs = (window.JVKLabData || []).map((item) => `<article class="page"><p class="eyebrow">Lab</p><h1 class="page-title">${escape(item.title)}</h1><p>${escape(item.question)}</p><p class="status">${escape(item.status)}</p></article>`).join("");
    return `<div class="page lab-page"><header class="page-header"><p class="eyebrow">Bancada de experimentos</p><h1 class="page-title">Lab</h1><p>Experimentos, perguntas e aprendizados em andamento.</p></header><section class="lab-list" aria-label="Experimentos do Lab">${labs}</section></div>`;
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

  const managementImage = (file, alt, width, height) => `<img src="assets/management-case/${file}" alt="${escape(alt)}" width="${width}" height="${height}" loading="eager" decoding="async">`;

  const renderManagementProject = () => {
    const screens = [
      { id: "central", title: "Central", file: "central-safe.png", width: 1919, height: 841 },
      { id: "empresas", title: "Empresas", file: "empresas-safe.png", width: 1919, height: 944 },
      { id: "acompanhamento", title: "Acompanhamento", file: "acompanhamento-safe.png", width: 1919, height: 942 },
      { id: "agenda", title: "Agenda", file: "agenda-safe.png", width: 1919, height: 901 },
      { id: "relatorios", title: "Relatórios", file: "relatorios-safe.png", width: 1919, height: 888 },
      { id: "modulos", title: "Módulos", file: "modulos-safe.png", width: 665, height: 527 }
    ];
    const figures = screens.map((screen, index) => `<figure class="management-frame${screen.id === "modulos" ? " management-frame--modules" : ""}" data-management-frame="${index}" id="management-${screen.id}"${index ? ' aria-hidden="true"' : ""}>${managementImage(screen.file, `Tela completa de ${screen.title} do Sistema de Gestão`, screen.width, screen.height)}</figure>`).join("");
    return `<article class="management-case" data-management-case><section class="management-flow" data-management-flow><div class="management-stage" data-management-stage><a href="#/work" class="management-return">Voltar</a><header class="management-title" data-management-title><h1>Sistema de Gestão</h1><p>Plataforma web em desenvolvimento para centralizar cadastros, acompanhamento anual, agenda, pendências e relatórios operacionais. As telas apresentam o produto em uso com dados fictícios.</p></header><div class="management-frames">${figures}</div></div></section><footer class="management-outro"><a href="#/work">Voltar aos projetos <span aria-hidden="true">↗</span></a></footer></article>`;
  };

  const renderProject = (id) => {
    const item = project(id);
    if (!item) return renderNotFound();
    if (id === "01") return renderManagementProject();
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

  const bindManagementProject = () => {
    const page = document.querySelector("[data-management-case]");
    if (!page) return;
    revealController = new AbortController();
    const flow = page.querySelector("[data-management-flow]");
    const stage = page.querySelector("[data-management-stage]");
    const title = page.querySelector("[data-management-title]");
    const frames = [...page.querySelectorAll("[data-management-frame]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;
    const paint = () => {
      ticking = false;
      if (reduced) return;
      const rect = flow.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = Math.max(1, flow.offsetHeight - stage.offsetHeight);
      const progress = Math.max(0, Math.min(1, (stickyTop - rect.top) / travel));
      const reveal = Math.max(0, Math.min(1, progress / .14));
      const sequence = Math.max(0, Math.min(1, (progress - .14) / .86));
      const position = sequence * (frames.length - 1);
      frames.forEach((frame, index) => {
        const delta = index - position;
        const visibility = Math.max(0, 1 - Math.abs(delta));
        frame.style.setProperty("--management-screen-opacity", visibility.toFixed(3));
        frame.style.setProperty("--management-screen-shift", `${(delta * 3.5).toFixed(2)}rem`);
        frame.style.setProperty("--management-screen-scale", (.985 + visibility * .015).toFixed(3));
        frame.style.zIndex = String(Math.round(visibility * 10));
        frame.setAttribute("aria-hidden", String(visibility < .5));
      });
      stage.style.setProperty("--management-title-opacity", (1 - reveal).toFixed(3));
      stage.style.setProperty("--management-title-shift", `${(-7 * reveal).toFixed(2)}rem`);
      stage.style.setProperty("--management-frame-opacity", reveal.toFixed(3));
      stage.style.setProperty("--management-frame-y", `${(48 * (1 - reveal)).toFixed(2)}vh`);
      stage.style.setProperty("--management-frame-scale", (.93 + .07 * reveal).toFixed(3));
      title.setAttribute("aria-hidden", String(reveal > .92));
    };
    const requestPaint = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };
    if (reduced) {
      frames.forEach((frame) => frame.removeAttribute("aria-hidden"));
      return;
    }
    window.addEventListener("scroll", requestPaint, { passive: true, signal: revealController.signal });
    window.addEventListener("resize", requestPaint, { passive: true, signal: revealController.signal });
    paint();
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

  const liquidIndicator = nav.querySelector(".nav-liquid-indicator");
  const liquidItems = [...nav.querySelectorAll("a[data-route], .language-toggle")];
  const liquidDesktop = window.matchMedia("(min-width: 981px)");
  const moveLiquidIndicator = (item) => {
    if (!liquidIndicator || !item || !liquidDesktop.matches) {
      liquidIndicator?.classList.remove("is-visible");
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (!itemRect.width) return;
    liquidIndicator.style.width = `${itemRect.width}px`;
    liquidIndicator.style.height = `${itemRect.height}px`;
    liquidIndicator.style.transform = `translate3d(${itemRect.left - navRect.left - nav.clientLeft}px, ${itemRect.top - navRect.top - nav.clientTop}px, 0)`;
    liquidIndicator.classList.add("is-visible");
    if (!liquidIndicator.classList.contains("is-ready")) {
      requestAnimationFrame(() => liquidIndicator.classList.add("is-ready"));
    }
  };
  const syncLiquidNav = () => {
    const focused = nav.contains(document.activeElement) ? document.activeElement.closest("a[data-route], .language-toggle") : null;
    moveLiquidIndicator(focused || nav.querySelector("a[aria-current]"));
  };
  liquidItems.forEach((item) => {
    item.addEventListener("pointerenter", () => moveLiquidIndicator(item));
    item.addEventListener("focus", () => moveLiquidIndicator(item));
  });
  nav.addEventListener("pointerleave", syncLiquidNav);
  nav.addEventListener("focusout", (event) => { if (!nav.contains(event.relatedTarget)) syncLiquidNav(); });
  nav.addEventListener("pointermove", (event) => {
    if (!liquidDesktop.matches) return;
    nav.style.setProperty("--nav-glint-x", `${event.clientX - nav.getBoundingClientRect().left}px`);
  });
  window.addEventListener("resize", () => requestAnimationFrame(syncLiquidNav));
  const syncLiquidScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 48);
  window.addEventListener("scroll", syncLiquidScroll, { passive: true });
  syncLiquidScroll();

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
    heroTypewriterCleanup?.();
    heroTypewriterCleanup = null;
    heroBuildCleanup?.();
    heroBuildCleanup = null;
    revealController?.abort();
    revealController = null;
    const current = route();
    const id = current.match(/^\/project\/(\d+)$/)?.[1];
    document.body.dataset.view = current === "/" ? "home" : id ? "project" : current.slice(1) || "home";
    document.body.classList.remove("management-project-view");
    document.body.classList.toggle("info-identity-view", current === "/info" || current === "/contact");
    main.innerHTML = current === "/" ? renderHome() : current === "/work" ? renderWork() : current === "/lab" ? renderLab() : current === "/areas" ? renderAreas() : current === "/certifications" ? renderCertifications() : current === "/info" ? renderInfo() : current === "/contact" ? renderInfo() : current === "/legal" ? renderLegal() : id ? renderProject(id) : renderNotFound();
    if (current === "/") {
      bindHomeCapabilitySyntax();
      bindHomeProjects();
      heroTypewriterCleanup = bindHeroTypewriter();
      heroBuildCleanup = bindHeroConstruction();
    }
    document.querySelectorAll("[data-route]").forEach((link) => link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`));
    bindDeck();
    requestAnimationFrame(syncLiquidNav);
    if (current === "/work") bindProjectGallery();
    if (id === "01") bindManagementProject();
    else if (id) bindProjectStory();
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

  const loadLanguage = async (selected, { persist = false } = {}) => {
    if (!supported.includes(selected)) return;
    const encodedLocale = window.JVKLocaleBase64?.[selected];
    if (!encodedLocale) throw new Error("Locale unavailable");
    const bytes = Uint8Array.from(atob(encodedLocale), (character) => character.charCodeAt(0));
    locale = JSON.parse(new TextDecoder("utf-8").decode(bytes)); language = selected;
    if (selected === "pt-BR" && window.JVKProjectData?.length === 6) locale.projects = window.JVKProjectData;
    if (persist) localStorage.setItem(storageKey, selected);
    applyStaticText(); render(); closeNavigation();
    closeLanguageMenu();
  };

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-language]");
    if (languageButton) {
      if (languageButton.disabled) return;
      loadLanguage(languageButton.dataset.language, { persist: true }).catch(() => { main.innerHTML = "<div class='page'></div>"; });
      return;
    }
    if (event.target.closest(".menu-toggle")) { const opening = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", opening); menuToggle.setAttribute("aria-expanded", String(opening)); return; }
    if (event.target.closest(".language-toggle")) { const opening = languageMenu.hidden; languageMenu.hidden = !opening; languageToggle.setAttribute("aria-expanded", String(opening)); return; }
    if (event.target.closest(".site-navigation a")) { closeNavigation(); return; }
    if (!event.target.closest(".language-toggle, #language-menu")) closeLanguageMenu();
  });
  window.addEventListener("hashchange", () => {
    render();
    if (route() === "/areas" || route() === "/certifications" || route() === "/work" || route() === "/lab" || route().startsWith("/project/")) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  loadLanguage("pt-BR").catch(() => { main.innerHTML = "<div class='page'></div>"; });

})();
