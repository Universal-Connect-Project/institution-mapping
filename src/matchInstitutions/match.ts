export const normalizeInstitutionName = (name: string): string => {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      // Remove common banking suffixes/prefixes but keep location indicators
      .replace(
        /\b(federal credit union|fcu|credit union|cu|national bank|state bank|community bank|savings bank|trust company|corp|corporation|inc|llc)\b/g,
        ""
      )
      .replace(/\b(bank)\b(?!\s+(of|for|in))/g, "") // Remove "bank" but not "bank of" or "bank for"
      .replace(/\s+/g, " ")
      .trim()
  );
};
