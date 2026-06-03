export const normalizeAdCategory = (value = '') => value.trim().toLowerCase();

export const adMatchesCategory = (adTargetCategory = 'all', currentCategory = '') => {
  const targetCategory = normalizeAdCategory(adTargetCategory || 'all');
  const selectedCategory = normalizeAdCategory(currentCategory);

  if (!selectedCategory) {
    return targetCategory === 'all';
  }

  return targetCategory === 'all' || targetCategory === selectedCategory;
};

export const getAdPlacements = (ad = {}) => {
  const values = Array.isArray(ad.placements) && ad.placements.length > 0
    ? ad.placements
    : [ad.placement || 'all'];

  return values.map((value) => {
    const placement = normalizeAdCategory(value || 'all');
    return placement === 'sidebar' ? 'all' : placement;
  });
};

export const adMatchesPlacement = (ad = {}, currentPlacement = 'all') => {
  const selectedPlacement = normalizeAdCategory(currentPlacement || 'all');
  const placements = getAdPlacements(ad);

  return placements.includes('all') || placements.includes(selectedPlacement);
};
