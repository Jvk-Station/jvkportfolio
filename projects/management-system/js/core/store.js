(function () {
const KEY = 'jvk.vetra.local.v1';
const empty = () => ({ route: 'overview', records: [], flows: [], organizations: [], events: [], tasks: [], activity: [] });
const memory = new Map();
const persistence = (() => {
  try {
    const probe = `${KEY}.probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch { return { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) }; }
})();

let state = load();
const listeners = new Set();

function load() {
  try {
    const saved = JSON.parse(persistence.getItem(KEY));
    return saved && typeof saved === 'object' ? { ...empty(), ...saved } : empty();
  } catch { return empty(); }
}

function persist() { persistence.setItem(KEY, JSON.stringify(state)); }
function emit() { persist(); listeners.forEach(listener => listener(state)); }

const store = {
  get: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  update(callback) { callback(state); emit(); },
  reset() { state = empty(); emit(); },
  uid(prefix) { return `${prefix}-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0, 8) : Date.now().toString(36)}`; },
  addActivity(kind, label) { state.activity.unshift({ id: this.uid('evt'), kind, label, at: new Date().toISOString() }); }
};
window.VetraStore = { store };
}());
