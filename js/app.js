(() => {
  const supported = ["pt-BR", "en", "es"];
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
  const text = (path) => path.split(".").reduce((value, key) => value?.[key], locale) ?? "";
  const project = (id) => locale.projects.find((item) => item.id === id);
  const statusClass = (status) => status === "AVAILABLE" ? "available" : "";
  const statusText = (status) => status === "AVAILABLE" ? text("work.available") : text("work.development");

  const projectCard = (item) => `<a class="project-card" href="#/project/${item.id}"><div><span class="project-index">${escape(item.id)}</span><h3>${escape(item.title)}</h3><p>${marked(item.summary)}</p></div><div class="card-footer"><span class="status ${statusClass(item.status)}">${escape(statusText(item.status))}</span><span aria-hidden="true">↗</span></div></a>`;
  const pageHeader = (eyebrow, title, lead) => `<header class="page-header"><p class="eyebrow">${escape(eyebrow)}</p><h1 class="page-title">${marked(title)}</h1>${lead ? `<p>${marked(lead)}</p>` : ""}</header>`;
  const notice = (value) => `<aside class="notice"><span aria-hidden="true">◇</span><p>${escape(value)}</p></aside>`;

  const renderHome = () => {
    const selected = locale.projects.slice(0, 3).map(projectCard).join("");
    const groups = locale.areas.groups.map((group) => `<article><h3>${escape(group.title)}</h3><ul>${group.items.slice(0, 4).map((item) => `<li>${escape(item)}</li>`).join("")}</ul></article>`).join("");
    return `<div class="page"><section class="hero"><div><p class="eyebrow">${escape(text("home.eyebrow"))}</p><h1>${marked(text("home.headline"))}</h1><div class="hero-copy">${locale.home.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}</div></div><aside class="hero-aside"><strong>${escape(text("home.asideTitle"))}</strong>${escape(text("home.aside"))}</aside></section><section class="section"><div class="section-heading"><h2>${escape(text("home.selected"))}</h2><a class="text-link" href="#/work">${escape(text("home.allWork"))} ↗</a></div><div class="project-grid">${selected}</div></section><section class="section"><div class="section-heading"><div><h2>${escape(text("home.areas"))}</h2><p class="hero-description">${escape(text("home.areasLead"))}</p></div><a class="text-link" href="#/areas">↗</a></div><div class="tool-groups">${groups}</div></section><section class="section"><div class="section-heading"><div><h2>${escape(text("home.certifications"))}</h2><p class="hero-description">${escape(text("home.certLead"))}</p></div><a class="text-link" href="#/certifications">↗</a></div></section>${notice(text("home.development"))}</div>`;
  };

  const renderWork = () => {
    const rows = locale.projects.map((item) => `<a class="project-row" href="#/project/${item.id}" data-status="${item.status}"><span class="project-index">${escape(item.id)}</span><h2>${escape(item.title)}</h2><p>${marked(item.summary)}</p><span class="status ${statusClass(item.status)}">${escape(statusText(item.status))}</span><span aria-hidden="true">↗</span></a>`).join("");
    return `<div class="page">${pageHeader(text("work.eyebrow"), text("work.title"), text("work.lead"))}<div class="filters" role="group" aria-label="${escape(text("work.filters"))}"><button class="filter is-active" type="button" data-filter="all">${escape(text("work.all"))}</button><button class="filter" type="button" data-filter="AVAILABLE">${escape(text("work.available"))}</button><button class="filter" type="button" data-filter="IN DEVELOPMENT">${escape(text("work.development"))}</button></div><section class="project-list">${rows}</section></div>`;
  };

  const renderProject = (id) => {
    const item = project(id);
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
  const renderInfo = () => `<div class="page">${pageHeader(text("info.eyebrow"), text("info.title"), text("info.lead"))}<section class="process-section"><h2>${escape(text("info.flowTitle"))}</h2><ol class="process-flow">${locale.info.flow.map((item) => `<li>${escape(item)}</li>`).join("")}</ol><p class="process-feedback">${escape(text("info.feedback"))}</p></section>${notice(text("info.development"))}</div>`;
  const renderContact = () => `<div class="page">${pageHeader(text("contact.eyebrow"), text("contact.title"), text("contact.lead"))}<section class="contact-grid">${locale.contact.items.map((item) => `<a class="contact-card" href="${escape(item.href)}"${item.href.startsWith("http") ? " target=\"_blank\" rel=\"noopener noreferrer\"" : ""}><span>${escape(item.label)}</span><h2>${escape(item.value)}</h2><small aria-hidden="true">↗</small></a>`).join("")}</section></div>`;
  const renderLegal = () => `<div class="page">${pageHeader(text("legal.eyebrow"), text("legal.title"))}<section class="legal-stack">${locale.legal.paragraphs.map((paragraph) => `<article class="legal-card"><p>${escape(paragraph)}</p></article>`).join("")}</section></div>`;
  const renderNotFound = () => `<div class="page">${pageHeader("404", text("notFound.title"))}<a class="demo-link" href="#/">${escape(text("notFound.back"))}</a></div>`;

  const route = () => location.hash.replace(/^#/, "") || "/";
  const render = () => {
    const current = route();
    const id = current.match(/^\/project\/(\d+)$/)?.[1];
    main.innerHTML = current === "/" ? renderHome() : current === "/work" ? renderWork() : current === "/areas" ? renderAreas() : current === "/certifications" ? renderCertifications() : current === "/info" ? renderInfo() : current === "/contact" ? renderContact() : current === "/legal" ? renderLegal() : id ? renderProject(id) : renderNotFound();
    document.querySelectorAll("[data-route]").forEach((link) => link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`));
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

  const loadLanguage = async (selected, { persist = true } = {}) => {
    if (!supported.includes(selected)) return;
    const encodedLocale = window.JVKLocaleBase64?.[selected];
    if (!encodedLocale) throw new Error("Locale unavailable");
    const bytes = Uint8Array.from(atob(encodedLocale), (character) => character.charCodeAt(0));
    locale = JSON.parse(new TextDecoder("utf-8").decode(bytes)); language = selected;
    if (persist) localStorage.setItem(storageKey, selected);
    applyStaticText(); render(); closeNavigation();
    modal.setAttribute("aria-hidden", "true");
    closeLanguageMenu();
  };

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-language]");
    if (languageButton) { loadLanguage(languageButton.dataset.language).catch(() => { main.innerHTML = "<div class='page'></div>"; }); return; }
    if (event.target.closest(".menu-toggle")) { const opening = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", opening); menuToggle.setAttribute("aria-expanded", String(opening)); return; }
    if (event.target.closest(".language-toggle")) { const opening = languageMenu.hidden; languageMenu.hidden = !opening; languageToggle.setAttribute("aria-expanded", String(opening)); return; }
    const filter = event.target.closest("[data-filter]");
    if (filter) { document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("is-active", button === filter)); document.querySelectorAll(".project-row").forEach((row) => { row.hidden = filter.dataset.filter !== "all" && row.dataset.status !== filter.dataset.filter; }); return; }
    if (event.target.closest(".site-navigation a")) { closeNavigation(); return; }
    if (!event.target.closest(".language-toggle, #language-menu")) closeLanguageMenu();
  });
  window.addEventListener("hashchange", () => { render(); main.focus({ preventScroll: true }); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeNavigation(); });

  const stored = localStorage.getItem(storageKey);
  if (supported.includes(stored)) loadLanguage(stored).catch(() => { modal.setAttribute("aria-hidden", "false"); });
  else modal.setAttribute("aria-hidden", "false");
})();


