(function () {
  'use strict';
  var listeners = [];
  var state = window.ManagementFixtures.createInitialState();

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function get() { return state; }
  function replace(next) { state = clone(next); notify(); }
  function update(mutator) { mutator(state); notify(); }
  function subscribe(listener) { listeners.push(listener); return function () { listeners = listeners.filter(function (item) { return item !== listener; }); }; }
  function notify() { listeners.forEach(function (listener) { listener(state); }); }

  window.ManagementState = { get: get, replace: replace, update: update, subscribe: subscribe, clone: clone };
}());

