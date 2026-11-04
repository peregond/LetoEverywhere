const KEY = 'serbian-summer-save-v2';
const AUTO_KEY='auto-v2';
let dbPromise;
function database() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('No IndexedDB'));
    const request = indexedDB.open('serbian-summer', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('saves');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Storage blocked'));
  });
  return dbPromise;
}
async function readDB() {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction('saves').objectStore('saves').get(AUTO_KEY);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}
export async function loadSave() {
  let local = null;
  try { local = JSON.parse(localStorage.getItem(KEY)); } catch { /* unavailable or invalid */ }
  const persisted = await readDB().catch(() => null);
  return [local, persisted].filter(Boolean).sort((a,b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0] ?? null;
}
let pending = Promise.resolve();
export function writeSave(state) {
  const snapshot = JSON.parse(JSON.stringify(state));
  let synchronous = false;
  try { localStorage.setItem(KEY, JSON.stringify(snapshot)); synchronous = true; } catch { /* IndexedDB may still work */ }
  pending = pending.catch(() => {}).then(async () => {
    const db = await database();
    return new Promise((resolve,reject) => {
      const tx = db.transaction('saves','readwrite');
      tx.objectStore('saves').put(snapshot,AUTO_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  });
  return pending.then(() => true, () => synchronous);
}
export function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem('ss-' + key)) ?? fallback; } catch { return fallback; }
}
export function writeLocal(key, value) {
  try { localStorage.setItem('ss-' + key, JSON.stringify(value)); } catch { /* optional preference */ }
}
