(() => {
  const form = document.querySelector("#document-form");
  const preview = document.querySelector("#preview");
  const pageCount = document.querySelector("#page-count");
  const saveState = document.querySelector("#save-state");
  const toast = document.querySelector("#toast");
  const modal = document.querySelector("#language-modal");
  const dateInput = form.elements.date;
  const stepCards = [...document.querySelectorAll("[data-step-card]")];
  const stepButtons = [...document.querySelectorAll("[data-step-target]")];
  const now = new Date();
  const BRAZIL_TIME_ZONE = "America/Sao_Paulo";
  const STAMP_CONFIG = Object.freeze({ systemName: "AuthorFlow", fixedPrefix: "criado por", schema: "AF-1.0" });
  let locale = "pt";
  let activeStep = 0;
  let generatedAt = now;
  let toastTimer;

  const translations = {
    pt: {
      skip: "Ir para o editor", draft: "Rascunho desta sessão", language: "Idioma", newDocument: "Novo documento", preparePdf: "Preparar PDF", editor: "EDITOR", buildDocument: "Monte seu documento", live: "Ao vivo", steps: "Etapas do editor", stepIdentity: "Identificação", stepContent: "Conteúdo", stepTypography: "Tipografia", stepStamp: "Carimbo", identityLegend: "Identificação do documento", documentName: "Nome do documento", subtitle: "Subtítulo", organization: "Organização", version: "Versão", author: "Responsável", date: "Data", contentLegend: "Conteúdo principal", summaryType: "Tipo do resumo", contextType: "Tipo do contexto", nextStepsType: "Tipo dos próximos passos", notesType: "Tipo das observações", normalText: "Texto normal", titleText: "Título", noticeText: "Aviso", typeHelp: "A escolha altera o tratamento visual do bloco.", summary: "Resumo executivo", context: "Contexto", nextSteps: "Próximos passos", notes: "Observações finais", typographyLegend: "Tipografia do documento", documentFont: "Fonte dos textos", systemFont: "Fonte do sistema", arial: "Arial", times: "Times New Roman", fontHelp: "A interface usa Author como família principal. A fonte escolhida é aplicada ao conteúdo gerado.", stampLegend: "Carimbo e assinatura", stampText: "Texto configurável do carimbo", signature: "Assinatura", role: "Função / cargo", signatureNote: "Observação da assinatura", stampConfigTitle: "Carimbo 85% configurável", stampConfigText: "Texto, assinatura e função vêm do formulário. Os 15% protegidos pelo código preservam a identificação do sistema, data/hora e paginação.", previous: "Voltar", next: "Continuar", preview: "PRÉ-VISUALIZAÇÃO", documentOutput: "Saída do documento", a4Pdf: "A4 · PDF", previewHelp: "A prévia permanece visível enquanto você avança pelos cards. Use “Preparar PDF” e escolha Salvar como PDF.", languageTitle: "Escolha o idioma", languageCopy: "Selecione como deseja utilizar o sistema. Espanhol está em preparação.", english: "English", portuguese: "Português", englishHint: "English interface", portugueseHint: "Interface em português", spanishPreparing: "Español · em preparação", page: "página", pages: "páginas", updatedAt: "Atualizado às", documentLabel: "DOCUMENTO", standardized: "Documento padronizado", createdBy: "criado por", protectedStamp: "Carimbo protegido · paginação automática", signatureLabel: "ASSINATURA", dateMissing: "Data não informada", untitled: "Documento sem título", noSummary: "Sem resumo executivo informado.", newStarted: "Novo documento iniciado.", reviewPdf: "Documento paginado em A4. Na janela seguinte, escolha ‘Salvar como PDF’.", clearConfirm: "Começar um novo documento e apagar este rascunho?"
    },
    en: {
      skip: "Skip to editor", draft: "Draft in this session", language: "Language", newDocument: "New document", preparePdf: "Prepare PDF", editor: "EDITOR", buildDocument: "Build your document", live: "Live", steps: "Editor steps", stepIdentity: "Identification", stepContent: "Content", stepTypography: "Typography", stepStamp: "Stamp", identityLegend: "Document identification", documentName: "Document name", subtitle: "Subtitle", organization: "Organization", version: "Version", author: "Owner", date: "Date", contentLegend: "Main content", summaryType: "Summary type", contextType: "Context type", nextStepsType: "Next steps type", notesType: "Notes type", normalText: "Normal text", titleText: "Title", noticeText: "Notice", typeHelp: "The choice changes the block's visual treatment.", summary: "Executive summary", context: "Context", nextSteps: "Next steps", notes: "Final notes", typographyLegend: "Document typography", documentFont: "Text font", systemFont: "System font", arial: "Arial", times: "Times New Roman", fontHelp: "The interface uses Author as its main family. The selected font is applied to generated content.", stampLegend: "Stamp and signature", stampText: "Configurable stamp text", signature: "Signature", role: "Role / position", signatureNote: "Signature note", stampConfigTitle: "85% configurable stamp", stampConfigText: "Text, signature and role come from the form. The 15% protected in code preserves the system identity, date/time and pagination.", previous: "Back", next: "Continue", preview: "PREVIEW", documentOutput: "Document output", a4Pdf: "A4 · PDF", previewHelp: "The preview stays visible while you move through the cards. Use “Prepare PDF” and choose Save as PDF.", languageTitle: "Choose your language", languageCopy: "Select how you want to use the system. Spanish is being prepared.", english: "English", portuguese: "Português", englishHint: "English interface", portugueseHint: "Interface em português", spanishPreparing: "Español · in preparation", page: "page", pages: "pages", updatedAt: "Updated at", documentLabel: "DOCUMENT", standardized: "Standardized document", createdBy: "created by", protectedStamp: "Protected stamp · automatic pagination", signatureLabel: "SIGNATURE", dateMissing: "Date not provided", untitled: "Untitled document", noSummary: "No executive summary provided.", newStarted: "New document started.", reviewPdf: "Document paginated in A4. In the next window, choose ‘Save as PDF’.", clearConfirm: "Start a new document and delete this draft?"
    }
  };

  const t = (key) => translations[locale][key] || translations.pt[key] || key;
  const localeTag = () => locale === "en" ? "en-US" : "pt-BR";
  const pad = (number) => String(number).padStart(2, "0");
  const brazilDateParts = (date) => Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: BRAZIL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const localDate = (date) => { const parts = brazilDateParts(date); return `${parts.year}-${parts.month}-${parts.day}`; };
  const dateLabel = (value) => { if (!value) return t("dateMissing"); const parsed = new Date(`${value}T12:00:00`); return Number.isNaN(parsed.getTime()) ? t("dateMissing") : new Intl.DateTimeFormat(localeTag(), { dateStyle: "long", timeZone: BRAZIL_TIME_ZONE }).format(parsed); };
  const dateTimeLabel = (date) => new Intl.DateTimeFormat(localeTag(), { dateStyle: "short", timeStyle: "short", timeZone: BRAZIL_TIME_ZONE }).format(date);
  const escape = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const paragraphs = (value) => String(value || "").trim().split(/\n+/).map((item) => item.trim()).filter(Boolean);
  const chunkParagraph = (text, max = 520) => { if (text.length <= max) return [text]; const words = text.split(/\s+/); const chunks = []; let current = ""; words.forEach((word) => { if (current && `${current} ${word}`.length > max) { chunks.push(current); current = word; } else current = current ? `${current} ${word}` : word; }); if (current) chunks.push(current); return chunks; };
  const read = () => Object.fromEntries([...new FormData(form).entries()]);
  const sectionBlocks = (data) => [
    { title: t("context"), type: data.contextType, paragraphs: paragraphs(data.context) },
    { title: t("nextSteps"), type: data.nextStepsType, paragraphs: paragraphs(data.nextSteps) },
    { title: t("notes"), type: data.notesType, paragraphs: paragraphs(data.notes) }
  ].filter((section) => section.paragraphs.length);
  const unitCount = (block) => 2 + block.paragraphs.reduce((sum, text) => sum + Math.max(1, Math.ceil(text.length / 125)), 0);
  const makePages = (data) => {
    const blocks = sectionBlocks(data).flatMap((block) => ({ title: block.title, type: block.type || "normal", paragraphs: block.paragraphs.flatMap((text) => chunkParagraph(text)) }));
    const pages = [{ blocks: [], units: 14 + Math.max(1, Math.ceil(String(data.summary || "").length / 125)) }];
    blocks.forEach((block) => { const blockUnits = unitCount(block); if (pages[pages.length - 1].blocks.length && pages[pages.length - 1].units + blockUnits > 34) pages.push({ blocks: [], units: 3 }); pages[pages.length - 1].blocks.push(block); pages[pages.length - 1].units += blockUnits; });
    if (pages[pages.length - 1].units + 8 > 34 && pages[pages.length - 1].blocks.length) pages.push({ blocks: [], units: 3 });
    return pages;
  };
  const renderSection = (block) => `<section class="document-section text-${escape(block.type)}"><h4>${escape(block.title)}</h4>${block.paragraphs.map((text) => `<p>${escape(text)}</p>`).join("")}</section>`;
  const renderStamp = (data) => `<div class="stamp-print"><strong>${escape(data.stampText || "Documento conferido para emissão")}</strong><span>${escape(STAMP_CONFIG.fixedPrefix)} ${escape(STAMP_CONFIG.systemName)} · ${escape(dateTimeLabel(generatedAt))} · ${escape(STAMP_CONFIG.schema)}</span></div>`;
  const renderSignature = (data) => `<div class="signature-block"><p class="signature-title">${escape(t("signatureLabel"))}</p><div class="signature-line"></div><strong>${escape(data.signatureName || t("signature"))}</strong><span>${escape(data.signatureRole || "")}</span><small>${escape(data.signatureNote || "")}</small></div>`;
  const renderPage = (data, blocks, index, total) => `<article class="page font-${escape(data.documentFont || "arial")}"><header class="page-header"><div><p class="eyebrow">${escape(t("documentLabel"))}</p><h3>${escape(data.title || t("untitled"))}</h3><p class="subtitle">${escape(data.subtitle || t("standardized"))}</p></div><div class="document-badge"><span>${escape(data.organization || t("organization"))}</span><strong>v${escape(data.version || "1.0")}</strong><span>${escape(dateLabel(data.date))}</span></div></header><div class="document-body">${index === 0 ? `<p class="lead text-${escape(data.summaryType || "normal")}">${escape(data.summary || t("noSummary"))}</p>` : ""}${blocks.map(renderSection).join("")}${index === total - 1 ? `${renderStamp(data)}${renderSignature(data)}` : ""}</div><footer class="document-footer"><span>${escape(t("protectedStamp"))}</span><span class="page-number">${index + 1} / ${total}</span></footer></article>`;
  const render = () => { const data = read(); const pages = makePages(data); preview.innerHTML = pages.map((page, index) => renderPage(data, page.blocks, index, pages.length)).join(""); pageCount.textContent = `${pages.length} ${pages.length === 1 ? t("page") : t("pages")}`; saveState.textContent = `${t("updatedAt")} ${dateTimeLabel(new Date())}`; renderSteps(); };
  const renderSteps = () => { stepCards.forEach((card, index) => { card.hidden = index !== activeStep; }); stepButtons.forEach((button, index) => button.classList.toggle("is-active", index === activeStep)); const previous = document.querySelector("[data-action='previous']"); const next = document.querySelector("[data-action='next']"); previous.disabled = activeStep === 0; next.textContent = activeStep === stepCards.length - 1 ? t("preparePdf") : t("next"); };
  const applyLanguage = () => { document.documentElement.lang = locale === "en" ? "en" : "pt-BR"; document.title = locale === "en" ? "Document editor" : "Editor de documentos"; document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); }); document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); }); render(); };
  const showModal = () => { modal.classList.add("is-visible"); };
  const hideModal = () => { modal.classList.remove("is-visible"); };
  const notify = (message) => { toast.textContent = message; toast.classList.add("is-visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200); };
  const setLocale = (nextLocale) => { if (!translations[nextLocale]) return; locale = nextLocale; try { localStorage.setItem("authorflow-locale", locale); } catch (error) { /* storage may be unavailable in local files */ } hideModal(); applyLanguage(); };
  const clearDocument = () => { if (!window.confirm(t("clearConfirm"))) return; form.reset(); dateInput.value = localDate(new Date()); generatedAt = new Date(); activeStep = 0; render(); notify(t("newStarted")); };
  const print = () => { generatedAt = new Date(); render(); notify(t("reviewPdf")); setTimeout(() => window.print(), 180); };

  let storedLocale = "";
  try { storedLocale = localStorage.getItem("authorflow-locale") || ""; } catch (error) { storedLocale = ""; }
  const hasSupportedLocale = Boolean(translations[storedLocale]);
  locale = hasSupportedLocale ? storedLocale : "pt";
  dateInput.value = localDate(now);
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  document.addEventListener("click", (event) => {
    const localeButton = event.target.closest("[data-locale]");
    if (localeButton) { setLocale(localeButton.dataset.locale); return; }
    const stepTarget = event.target.closest("[data-step-target]");
    if (stepTarget) { activeStep = Number(stepTarget.dataset.stepTarget); renderSteps(); return; }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "language") showModal();
    if (action === "clear") clearDocument();
    if (action === "previous" && activeStep > 0) { activeStep -= 1; renderSteps(); }
    if (action === "next") { if (activeStep === stepCards.length - 1) print(); else { activeStep += 1; renderSteps(); } }
    if (action === "print") print();
  });
  applyLanguage();
  if (!hasSupportedLocale) showModal();
})();
