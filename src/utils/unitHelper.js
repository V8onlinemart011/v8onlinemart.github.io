// Universal Packaging & Unit Configuration Helper for V8 Online Mart
// Used across both Admin Portal and Customer Storefront Website

export const PACKAGING_UNITS = [
  { id: 'case', label_km: 'គិតជាកេស', label_en: 'Case', short_km: 'កេស', emoji: '📦', tag: '(គិតជាកេស)', color: 'emerald' },
  { id: 'sleeve', label_km: 'គិតជាយួរ', label_en: 'Sleeve (6-Pack)', short_km: 'យួរ', emoji: '🧺', tag: '(គិតជាយួរ)', color: 'blue' },
  { id: 'can', label_km: 'គិតជាកំប៉ុង', label_en: 'Can', short_km: 'កំប៉ុង', emoji: '🥫', tag: '(កំប៉ុង)', color: 'rose' },
  { id: 'bottle', label_km: 'គិតជាដប', label_en: 'Bottle', short_km: 'ដប', emoji: '🍾', tag: '(ដប)', color: 'amber' },
  { id: 'pack', label_km: 'គិតជាកញ្ចប់', label_en: 'Pack', short_km: 'កញ្ចប់', emoji: '🛍️', tag: '(កញ្ចប់)', color: 'purple' },
  { id: 'box', label_km: 'គិតជាប្រអប់', label_en: 'Box', short_km: 'ប្រអប់', emoji: '📦', tag: '(ប្រអប់)', color: 'indigo' },
  { id: 'kg', label_km: 'គិតជាគីឡូ', label_en: 'Kg', short_km: 'គីឡូ', emoji: '⚖️', tag: '(គីឡូ)', color: 'teal' },
  { id: 'cup', label_km: 'គិតជាកែវ', label_en: 'Cup', short_km: 'កែវ', emoji: '🥤', tag: '(កែវ)', color: 'pink' },
  { id: 'strip', label_km: 'គិតជាបន្ទះ', label_en: 'Strip', short_km: 'បន្ទះ', emoji: '💊', tag: '(បន្ទះ)', color: 'cyan' },
  { id: 'piece', label_km: 'គិតជាដើម/ដុំ', label_en: 'Piece', short_km: 'ដុំ', emoji: '🏷️', tag: '(ដុំ)', color: 'slate' }
];

export const UNIT_TAG_REGEX = /\s*\((គិតជាកេស|គិតជាកេះ|កេស|កេះ|Case|គិតជាយួរ|យួរ|Sleeve|គិតជាកំប៉ុង|កំប៉ុង|Can|គិតជាដប|ដប|Bottle|គិតជាកញ្ចប់|កញ្ចប់|Pack|គិតជាប្រអប់|ប្រអប់|Box|គិតជាគីឡូ|គីឡូ|Kg|គិតជាកែវ|កែវ|Cup|គិតជាបន្ទះ|បន្ទះ|Strip|គិតជាដើម|ដើម|គិតជាដុំ|ដុំ|Piece)\)/gi;

export const applyUnitToTitle = (currentTitle, newUnitTag) => {
  const cleaned = (currentTitle || '').replace(UNIT_TAG_REGEX, '').trim();
  if (!newUnitTag) return cleaned;
  return cleaned ? `${cleaned} ${newUnitTag}` : newUnitTag;
};

export const cleanProductTitle = (title) => {
  if (!title) return '';
  return title.replace(UNIT_TAG_REGEX, '').trim();
};

export const detectUnitFromTitle = (title) => {
  if (!title) return '';
  const t = title.toLowerCase();
  if (t.includes('កេស') || t.includes('កេះ') || t.includes('case')) return 'កេស';
  if (t.includes('យួរ') || t.includes('sleeve')) return 'យួរ';
  if (t.includes('កំប៉ុង') || t.includes('can')) return 'កំប៉ុង';
  if (t.includes('ដប') || t.includes('bottle')) return 'ដប';
  if (t.includes('កញ្ចប់') || t.includes('pack')) return 'កញ្ចប់';
  if (t.includes('ប្រអប់') || t.includes('box')) return 'ប្រអប់';
  if (t.includes('គីឡូ') || t.includes('kg')) return 'គីឡូ';
  if (t.includes('កែវ') || t.includes('cup')) return 'កែវ';
  if (t.includes('បន្ទះ') || t.includes('strip')) return 'បន្ទះ';
  if (t.includes('ដុំ') || t.includes('ដើម') || t.includes('piece')) return 'ដុំ';
  return '';
};

// Robust detector resolving from product.unit or product title
export const getProductUnitInfo = (productOrTitle) => {
  if (!productOrTitle) return null;

  let unitStr = '';
  let titleStr = '';

  if (typeof productOrTitle === 'object') {
    unitStr = productOrTitle.unit || '';
    titleStr = `${productOrTitle.title_kh || ''} ${productOrTitle.title_en || ''}`;
  } else if (typeof productOrTitle === 'string') {
    unitStr = productOrTitle;
    titleStr = productOrTitle;
  }

  // 1. Try matching directly by unit string
  if (unitStr) {
    const cleanU = unitStr.toLowerCase().trim();
    const found = PACKAGING_UNITS.find(u => 
      u.short_km.toLowerCase() === cleanU || 
      u.id.toLowerCase() === cleanU || 
      u.label_km.toLowerCase() === cleanU || 
      u.label_en.toLowerCase() === cleanU ||
      cleanU.includes(u.short_km.toLowerCase())
    );
    if (found) return found;
  }

  // 2. Fallback to detecting from title string
  const detectedShort = detectUnitFromTitle(titleStr);
  if (detectedShort) {
    const found = PACKAGING_UNITS.find(u => u.short_km === detectedShort);
    if (found) return found;
  }

  // 3. If custom unit string provided that is not in the preset list
  if (unitStr && unitStr.trim()) {
    const trimmed = unitStr.trim();
    return {
      id: 'custom',
      label_km: `គិតជា${trimmed}`,
      label_en: trimmed,
      short_km: trimmed,
      emoji: '📦',
      tag: `(${trimmed})`,
      color: 'emerald'
    };
  }

  return null;
};

// Ready-to-render badge properties
export const getProductUnitBadge = (product, lang = 'km') => {
  const unitInfo = getProductUnitInfo(product);
  if (!unitInfo) return null;

  const isKm = lang === 'km';
  const label = isKm ? unitInfo.label_km : unitInfo.label_en;
  const shortLabel = isKm ? unitInfo.short_km : unitInfo.label_en;
  const fullBadge = `${unitInfo.emoji} ${label}`;
  const perText = isKm ? `/ ${unitInfo.short_km}` : `/ ${unitInfo.label_en}`;

  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25',
    pink: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
    slate: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25'
  };

  return {
    ...unitInfo,
    label,
    shortLabel,
    fullBadge,
    perText,
    badgeClasses: colorStyles[unitInfo.color] || colorStyles.emerald
  };
};

// Default units per bulk package (e.g. 24 cans per case, 12 per box)
export const getDefaultPiecesPerCase = (unitOrTitle) => {
  const info = getProductUnitInfo(unitOrTitle);
  if (!info) return 24;
  if (info.id === 'can' || info.id === 'bottle') return 24;
  if (info.id === 'sleeve') return 6;
  if (info.id === 'box' || info.id === 'pack') return 12;
  if (info.id === 'strip') return 10;
  return 24;
};

// Calculate total stock from Cases + Multiplier + Loose
export const calculateTotalUnits = (cases, piecesPerCase = 24, loose = 0) => {
  const c = parseInt(cases, 10) || 0;
  const p = Math.max(1, parseInt(piecesPerCase, 10) || 24);
  const l = parseInt(loose, 10) || 0;
  return Math.max(0, (c * p) + l);
};

// Break down total units into Cases + Loose units for remaining stock display
export const getStockBreakdown = (totalUnits, piecesPerCase = 24, retailUnitName = 'កំប៉ុង', caseUnitName = 'កេស') => {
  const total = Math.max(0, parseInt(totalUnits, 10) || 0);
  const perCase = Math.max(1, parseInt(piecesPerCase, 10) || 24);

  const cases = Math.floor(total / perCase);
  const loose = total % perCase;
  const caseDecimal = (total / perCase).toFixed(1);

  let textKm = '';
  let textEn = '';

  if (cases > 0 && loose > 0) {
    textKm = `${cases} ${caseUnitName} + ${loose} ${retailUnitName}`;
    textEn = `${cases} Cases + ${loose} Units`;
  } else if (cases > 0 && loose === 0) {
    textKm = `${cases} ${caseUnitName}`;
    textEn = `${cases} Cases`;
  } else {
    textKm = `${loose} ${retailUnitName}`;
    textEn = `${loose} Units`;
  }

  return {
    total,
    perCase,
    cases,
    loose,
    caseDecimal,
    textKm,
    textEn,
    hasBreakdown: perCase > 1
  };
};

