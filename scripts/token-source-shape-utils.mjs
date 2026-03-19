function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTokenLeaf(value) {
  return isPlainObject(value) && typeof value.value === "string";
}

export function ensureNonEmptyObject(value, label) {
  if (!isPlainObject(value) || Object.keys(value).length === 0) {
    throw new Error(`${label} must be a non-empty object`);
  }
}

export function getByPath(object, path) {
  return path.reduce((current, segment) => {
    if (!isPlainObject(current) || !(segment in current)) {
      return undefined;
    }

    return current[segment];
  }, object);
}

export function ensurePathShape(object, path, label) {
  const value = getByPath(object, path);
  if (value === undefined) {
    throw new Error(`${label} is missing required path: ${path.join(".")}`);
  }

  ensureNonEmptyObject(value, `${label}.${path.join(".")}`);
  return value;
}

export function ensureLeafGroup(object, label) {
  ensureNonEmptyObject(object, label);

  for (const [key, value] of Object.entries(object)) {
    if (!isTokenLeaf(value) || !value.value.trim()) {
      throw new Error(
        `${label}.${key} must be a token leaf with a non-empty string value`,
      );
    }
  }
}

export function collectShape(node) {
  if (isTokenLeaf(node)) {
    return "__leaf__";
  }

  if (!isPlainObject(node)) {
    return "__invalid__";
  }

  const shape = {};
  for (const [key, value] of Object.entries(node)) {
    shape[key] = collectShape(value);
  }
  return shape;
}

export function compareShape(left, right, leftLabel, rightLabel) {
  const leftShape = collectShape(left);
  const rightShape = collectShape(right);

  const leftSerialized = JSON.stringify(leftShape);
  const rightSerialized = JSON.stringify(rightShape);

  if (leftSerialized !== rightSerialized) {
    throw new Error(
      `${leftLabel} and ${rightLabel} must expose the same structural shape`,
    );
  }
}

export function hasAnyPath(object, paths) {
  return paths.some((path) => getByPath(object, path) !== undefined);
}

export function collectTopLevelCategories(base, themeFiles) {
  const categories = new Set();

  const globalKeys = Object.keys(base?.global ?? {});
  for (const key of globalKeys) {
    categories.add(key);
  }

  for (const [themeName, source] of Object.entries(themeFiles)) {
    const themeRoot = source?.theme?.[themeName];
    if (!isPlainObject(themeRoot)) {
      continue;
    }

    for (const key of Object.keys(themeRoot)) {
      categories.add(key);
    }
  }

  return categories;
}
