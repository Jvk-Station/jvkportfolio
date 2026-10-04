(() => {
  const state = () => window.PortalState.state;
  const set = (next) => window.PortalState.setState(next);
  const firstCategory = (audienceId) => window.PortalSearch.getCategoriesByAudience(audienceId)[0]?.id || "all";
  const goHome = () => set({ view: "home", contentId: null, mapSelection: null, query: "", searchAudienceId: "all", searchCategoryId: "all", searchTypeId: "all" });
  const goExplore = (audienceId = state().audienceId || "audience-01", categoryId = "all") => set({ view: "explore", audienceId, categoryId, subcategoryId: "all", contentId: null, mapSelection: null });
  const goCategory = (audienceId, categoryId) => goExplore(audienceId, categoryId || firstCategory(audienceId));
  const goSearch = (query = state().query) => set({ view: "search", query, contentId: null, mapSelection: null });
  const goDetail = (contentId) => { const content = window.PortalSearch.getContent(contentId); if (content) set({ view: "detail", audienceId: content.audienceId, categoryId: content.categoryId, contentId, mapSelection: null }); };
  const goMap = (audienceId = state().audienceId || "all", categoryId = "all") => set({ view: "map", mapAudienceId: audienceId, mapCategoryId: categoryId, mapSelection: null, contentId: null });
  window.PortalRouter = { goHome, goExplore, goCategory, goSearch, goDetail, goMap };
})();

