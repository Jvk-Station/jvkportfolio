(() => {
  const state = {
    view: "home", audienceId: null, categoryId: "all", subcategoryId: "all", contentId: null,
    query: "", searchAudienceId: "all", searchCategoryId: "all", searchTypeId: "all",
    mapAudienceId: "all", mapCategoryId: "all", mapLayerId: "layer-01", mapSelection: null, mapElevated: false,
  };
  const setState = (nextState) => Object.assign(state, nextState);
  window.PortalState = { state, setState };
})();
