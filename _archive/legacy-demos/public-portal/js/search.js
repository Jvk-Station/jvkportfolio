(() => {
  const data = () => window.PortalFixtures;
  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const findById = (items, id) => items.find((item) => item.id === id);
  const getAudience = (id) => findById(data().audiences, id);
  const getCategory = (id) => findById(data().categories, id);
  const getSubcategory = (id) => findById(data().subcategories, id);
  const getContent = (id) => findById(data().contents, id);
  const getType = (id) => findById(data().contentTypes, id);
  const getArea = (id) => findById(data().syntheticAreas, id);
  const getPoint = (id) => findById(data().syntheticPoints, id);
  const getCategoriesByAudience = (audienceId) => data().categories.filter((item) => item.audienceId === audienceId);
  const getSubcategoriesByCategory = (categoryId) => data().subcategories.filter((item) => item.categoryId === categoryId);
  const filterContents = ({ query = "", audienceId = "all", categoryId = "all", subcategoryId = "all", typeId = "all" } = {}) => {
    const term = normalize(query);
    return data().contents.filter((content) => {
      const category = getCategory(content.categoryId);
      const subcategory = getSubcategory(content.subcategoryId);
      const type = getType(content.typeId);
      const searchable = [content.title, content.summary, category?.label, subcategory?.label, type?.label, ...content.blocks.map((block) => block.title)].map(normalize).join(" ");
      return (!term || searchable.includes(term)) && (audienceId === "all" || content.audienceId === audienceId) && (categoryId === "all" || content.categoryId === categoryId) && (subcategoryId === "all" || content.subcategoryId === subcategoryId) && (typeId === "all" || content.typeId === typeId);
    });
  };
  const getRelatedContents = (content) => content.relatedIds.map(getContent).filter(Boolean);
  const getVisibleAreas = ({ audienceId = "all", categoryId = "all" } = {}) => data().syntheticAreas.filter((area) => (audienceId === "all" || area.audienceId === audienceId) && (categoryId === "all" || area.categoryId === categoryId));
  const getVisiblePoints = (areaIds) => data().syntheticPoints.filter((point) => areaIds.includes(point.areaId));
  const getContentForAreas = (areaIds) => data().contents.filter((content) => content.areaIds.some((id) => areaIds.includes(id)));
  window.PortalSearch = { getAudience, getCategory, getSubcategory, getContent, getType, getArea, getPoint, getCategoriesByAudience, getSubcategoriesByCategory, filterContents, getRelatedContents, getVisibleAreas, getVisiblePoints, getContentForAreas };
})();

