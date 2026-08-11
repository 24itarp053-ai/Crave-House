/**
 * reservationStorage.js
 *
 * Safe localStorage helpers for craveHouseReservations.
 * All functions handle missing keys, empty arrays, and corrupted JSON gracefully.
 *
 * localStorage key: 'craveHouseReservations'
 * Shape: Array of reservation objects
 *
 * To replace with a real API later, only these functions need to change —
 * no UI components need to be touched.
 */

const STORAGE_KEY = 'craveHouseReservations';

/**
 * Read all reservations from localStorage.
 * @returns {Array} reservations array (may be empty)
 */
export function getReservations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('[craveHouseReservations] Failed to parse storage:', err);
    return [];
  }
}

/**
 * Persist the full reservations array to localStorage.
 * @param {Array} reservations
 */
export function saveReservations(reservations) {
  try {
    if (!Array.isArray(reservations)) {
      console.error('[craveHouseReservations] saveReservations expects an array');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch (err) {
    console.error('[craveHouseReservations] Failed to write storage:', err);
  }
}

/**
 * Append a single new reservation to the existing array.
 * @param {object} reservation
 */
export function addReservation(reservation) {
  const existing = getReservations();
  existing.push(reservation);
  saveReservations(existing);
}

/**
 * Update a single reservation in-place (matched by id).
 * @param {string} id
 * @param {object} updates — partial object to merge
 * @returns {Array} updated reservations array
 */
export function updateReservation(id, updates) {
  const reservations = getReservations();
  const updated = reservations.map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  saveReservations(updated);
  return updated;
}

/**
 * Generate a unique temporary reservation ID.
 * Format: CH-R<6-digit random>  e.g. CH-R482931
 * @returns {string}
 */
export function generateReservationId() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `CH-R${rand}`;
}
