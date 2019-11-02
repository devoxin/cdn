function preview (el) {
  const fileName = el.innerText;

  const fileList = document.querySelector('.file-list');
  const previewPane = document.querySelector('.previewer-pane');

  if (previewPane.classList.contains('hidden')) {
    previewPane.classList.remove('hidden');
    fileList.classList.add('shrink');
  }
}