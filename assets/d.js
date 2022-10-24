let dragTimer = null;
let isSidebarSwipe = false, swipeStart = 0;

function toggleSidebar () {
  document.querySelector('.sidebar').classList.toggle('unhide-slide');
}

function preview (el) {
  const previewPane = document.querySelector('.previewer-pane');
  previewPane.classList.add('unhide-opacity');
}

function previewHide (el) {
  el.classList.remove('unhide-opacity');
}

function onFileDrag (e) {
  e.stopPropagation();
  e.preventDefault();
  clearTimeout(dragTimer);

  const dt = e.dataTransfer;
  const files = [...(dt.items || dt.files)];
  dt.dropEffect = 'copy';

  if (files.some(file => file.kind === 'file')) {
    // document.querySelector('.dropzone').style.visibility = 'visible';
    document.querySelector('.dropzone').classList.add('unhide-scale');
  }
}

function onFileDragLeave (e) {
  e.stopPropagation();
  e.preventDefault();

  clearTimeout(dragTimer);
  // dragTimer = setTimeout(() => document.querySelector('.dropzone').style.visibility = 'hidden', 85);
  dragTimer = setTimeout(() => document.querySelector('.dropzone').classList.remove('unhide-scale'), 85);
}

function onFileDragDrop (e) {
  e.stopPropagation();
  e.preventDefault();
  document.querySelector('.dropzone').classList.remove('unhide-scale');

  const dt = e.dataTransfer;
  const files = [...(dt.items || dt.files)];

  for (const file of files) {
    createFileUpload(file.getAsFile());
  }
}

function createFileUpload (file) {
  const row = createElement('tr');
  const fileColumn = createElement('td');
  const modifiedColumn = createElement('td', { innerText: formatDate(new Date(), 'yyyy-mm-dd HH:MM') });
  const expiresColumn = createElement('td', { innerText: 'Never' });

  fileColumn.setAttribute('onclick', 'preview(this)');

  const fileIcon = createElement('i', { innerText: 'insert_drive_file' });
  fileIcon.classList.add('material-icons');
  fileColumn.append(fileIcon);

  const fileNameText = document.createTextNode(file.name);
  fileColumn.append(fileNameText);

  const progressBar = createElement('progress', { max: '100' });
  fileColumn.append(progressBar);

  row.append(fileColumn);
  row.append(modifiedColumn);
  row.append(expiresColumn);

  document.querySelector('.file-list').append(row);

  const interval = setInterval(() => {
    progressBar.value += 1;
    if (progressBar.value >= progressBar.max) {
      clearInterval(interval);
      progressBar.remove();
    }
  }, 110);
}

function createElement (element, options) {
  return Object.assign(document.createElement(element), options);
}

function formatDate (date, format) {
  const formatMap = {
    HH: padValue(date.getHours()),
    MM: padValue(date.getMinutes()),
    mm: padValue(date.getMonth() + 1),
    dd: padValue(date.getDate()),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear()
  };

  return format.replace(/HH|MM|mm|dd|yyyy|yy/g, matched => formatMap[matched]);
}

function padValue (value) {
  return (value < 10) ? '0' + value : value;
}

function onTouchStart (event) {
  isSidebarSwipe = event.targetTouches[0].clientX < 200;
  swipeStart = event.targetTouches[0].clientX;
}

function onTouchMove (event) {
  if (isSidebarSwipe) {
    event.preventDefault();
    const x = event.touches[0].clientX;
    const sb = document.querySelector('.sidebar')
    const difference = x - swipeStart;
    // this is broken for close swipes

    const left1 = Math.max(Math.min(difference, 202), 0);
    const left = Math.min(-202 + left1, 0);
    // console.log("left: " + left);
    sb.style.left = left + 'px';
  }
}

function onTouchCancel (event) {
  if (isSidebarSwipe) {
    const sb = document.querySelector('.sidebar');
    const left = parseInt(sb.style.left);
    if (left >= -130 && left < 0) {
      sb.style.left = '0px';
    } else if (left < -130) {
      sb.style.left = '-202px';
    }
  }
}

window.addEventListener('dragover', onFileDrag);
window.addEventListener('dragleave', onFileDragLeave);
// window.addEventListener('touchstart', onTouchStart);
// window.addEventListener('touchmove', onTouchMove, { passive: false });
// window.addEventListener('touchend', onTouchCancel);
// window.addEventListener('touchcancel', onTouchCancel);
