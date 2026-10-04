(function () {
  'use strict';
  var key = 'jvk-management-showcase-v1';

  function load() {
    try {
      var value = localStorage.getItem(key);
      if (!value) return null;
      var parsed = JSON.parse(value);
      return parsed && Array.isArray(parsed.records) && Array.isArray(parsed.history) ? parsed : null;
    } catch (error) { return null; }
  }

  function save(state) {
    try { localStorage.setItem(key, JSON.stringify(state)); return true; }
    catch (error) { return false; }
  }

  function reset() {
    try { localStorage.removeItem(key); } catch (error) { /* armazenamento indisponível */ }
  }

  window.ManagementStorage = { load: load, save: save, reset: reset };
}());

