(function () {
const paths = {
  mark: '<path d="M5 5h14v10l-7 5-7-5V5Z"/><path d="m8.5 9.5 3.5 3 3.5-3"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  flow: '<path d="M6 4v7a3 3 0 0 0 3 3h9"/><path d="m15 10 3 4-3 4"/><path d="M18 5h-4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01"/>',
  records: '<path d="M6 3.5h9l3 3V20H6z"/><path d="M15 3.5v4h3M9 12h6M9 15.5h4"/>',
  directory: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h.01M11 9h5M8 13h.01M11 13h5M8 17h.01M11 17h3"/>',
  tasks: '<path d="m5 12 4 4 10-10"/><path d="M20 12v7H4V5h11"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-4M12 16V7M16 16v-8"/>',
  activity: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04-2.12 2.12-.04-.04a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56v.06h-3v-.06A1.7 1.7 0 0 0 10.66 18.7a1.7 1.7 0 0 0-1.88.34l-.04.04-2.12-2.12.04-.04A1.7 1.7 0 0 0 7 15.04a1.7 1.7 0 0 0-1.56-1.04h-.06v-3h.06A1.7 1.7 0 0 0 7 9.96a1.7 1.7 0 0 0-.34-1.88l-.04-.04 2.12-2.12.04.04A1.7 1.7 0 0 0 10.66 6.3a1.7 1.7 0 0 0 1.04-1.56v-.06h3v.06a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.04-.04 2.12 2.12-.04.04A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.06v3h-.06A1.7 1.7 0 0 0 19.4 15Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 16 18 16 18 9ZM10 21h4"/>',
  search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/>',
  arrow: '<path d="M5 12h13M13 7l5 5-5 5"/>',
  trash: '<path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/>'
};

function icon(name, label = '') {
  return `<svg viewBox="0 0 24 24" aria-hidden="${label ? 'false' : 'true'}"${label ? ` aria-label="${label}"` : ''}>${paths[name] || paths.grid}</svg>`;
}
window.VetraIcons = { icon };
}());
