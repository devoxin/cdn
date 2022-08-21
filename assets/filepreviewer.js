function preview (el) {
  const previewPane = document.querySelector('.previewer-pane');
  previewPane.classList.add('unhide');
}

function hide (el) {
  el.classList.remove('unhide');
}