let clipboard;

export function getClipboard() {
  return clipboard || (clipboard = require('clipboard-polyfill/text'));
}
