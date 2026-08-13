(function () {
  'use strict';
  function canEdit(state) { return state.mode === 'edit'; }
  window.ManagementPermissions = { canEdit: canEdit };
}());

