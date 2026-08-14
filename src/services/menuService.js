/**
 * menuService.js
 * Centralized API service for menu and category data.
 * All components should use these functions — never fetch directly from pages.
 */

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.warn('[menuService] VITE_API_URL is not set. API calls will fail.');
}

/**
 * Slug mapping: frontend route slug → MongoDB category slug
 * Frontend uses singular forms; MongoDB uses some plural forms.
 */
const SLUG_MAP = {
  burger: 'burgers',
  salad: 'salads',
  // pizza, pasta, drinks, desserts are already identical
};

export const toApiSlug = (frontendSlug) => SLUG_MAP[frontendSlug] || frontendSlug;

// Eagerly load all image assets using Vite's glob import
const imageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default'
});

/**
 * Normalize a raw API item so existing card components receive expected fields.
 * - price: number (279) → string ('₹279')
 * - ingredients: string[] → joined string for ProductDetail display
 * - id, image, rating, name, description, isPopular, isAvailable pass through unchanged
 */
export const normalizeItem = (raw) => {
  let resolvedImage = raw.image;

  if (raw.image && typeof raw.image === 'string') {
    // Extract filename (e.g. "cold-coffee.jpg" from "/src/assets/images/cold-coffee.jpg")
    const filename = raw.image.split('/').pop();
    const mapKey = `../assets/images/${filename}`;
    if (imageModules[mapKey]) {
      resolvedImage = imageModules[mapKey];
    }
  }

  return {
    ...raw,
    image: resolvedImage,
    // Cards render {product.price} expecting a rupee string
    price: `₹${raw.price}`,
    // ProductDetail renders {details.ingredients} as a paragraph
    ingredients: Array.isArray(raw.ingredients)
      ? raw.ingredients.join(', ')
      : raw.ingredients ?? '',
  };
};

/**
 * Internal fetch helper.
 * Returns parsed JSON or throws an error with a user-friendly message.
 */
async function apiFetch(path) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.message) msg = body.message;
    } catch (_) {}
    throw new Error(msg);
  }

  return response.json();
}

/**
 * Build a query string from a params object, omitting undefined/null/empty values.
 * Prevents ?search=undefined&sort=undefined pollution.
 */
function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, value);
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// ─── Categories ─────────────────────────────────────────────────────────────

/**
 * GET /api/categories
 * Returns all active categories.
 */
export async function getCategories() {
  const data = await apiFetch('/categories');
  return data.categories;
}

/**
 * GET /api/categories/:slug
 * @param {string} slug — frontend route slug (will be mapped to API slug)
 */
export async function getCategoryBySlug(slug) {
  const apiSlug = toApiSlug(slug);
  const data = await apiFetch(`/categories/${apiSlug}`);
  return data.category;
}

// ─── Menu Items ──────────────────────────────────────────────────────────────

/**
 * GET /api/menu
 * @param {object} params - { search, minPrice, maxPrice, minRating, popular, sort, page, limit }
 */
export async function getMenuItems(params = {}) {
  const query = buildQuery(params);
  const data = await apiFetch(`/menu${query}`);
  return {
    items: data.items.map(normalizeItem),
    total: data.total,
    totalPages: data.totalPages,
    page: data.page,
  };
}

/**
 * GET /api/menu/category/:slug
 * @param {string} frontendSlug - the slug used in frontend routes (e.g. 'burger', 'salad')
 * @param {object} params - { search, maxPrice, minRating, sort, page, limit }
 */
export async function getMenuItemsByCategory(frontendSlug, params = {}) {
  const apiSlug = toApiSlug(frontendSlug);
  const query = buildQuery(params);
  const data = await apiFetch(`/menu/category/${apiSlug}${query}`);
  return {
    items: data.items.map(normalizeItem),
    total: data.total,
    totalPages: data.totalPages,
    page: data.page,
  };
}

/**
 * GET /api/menu/:id
 * @param {string} id — MongoDB ObjectId string
 */
export async function getMenuItemById(id) {
  const data = await apiFetch(`/menu/${id}`);
  return normalizeItem(data.item);
}
