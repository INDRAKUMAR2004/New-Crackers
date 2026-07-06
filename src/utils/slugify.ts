"use client";
export const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const makeUniqueSlug = (
  baseSlug,
  existingSlugs = [],
  currentSlug = ''
) => {
  const cleanedBase = slugify(baseSlug) || 'item';
  const current = slugify(currentSlug);

  const used = new Set(
    existingSlugs
      .map((item) => slugify(item))
      .filter(Boolean)
      .filter((item) => item !== current)
  );

  if (!used.has(cleanedBase)) return cleanedBase;

  let counter = 2;
  let next = `${cleanedBase}-${counter}`;
  while (used.has(next)) {
    counter += 1;
    next = `${cleanedBase}-${counter}`;
  }

  return next;
};
