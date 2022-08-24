function upload () {
  const button = document.querySelector('button#upload');
  button.setAttribute('disabled', '');
  button.innerHTML = 'Please wait...';

  const fileinput = document.querySelector('input#file');

  const file = new FormData();
  file.append('file', fileinput.files[0]);

  const onUploadProgress = (e) => {
    const percentCompleted = e.loaded / e.total * 100;
    document.getElementById('progress').style.width = `${percentCompleted}%`;
  };

  doUpload(file, onUploadProgress).then(({ data }) => {
    /**
     * @TODO Full URL returned by server. Domain specified in config.
    */
    const link = `https://serux.pro/${data}`;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch(() => showLink(link));
    } else {
      showLink(link);
    }
}).catch(err => {
  if (err.response) {
    alert(err.response.data);
  } else {
    alert(err.message);
  }
}).finally(() => {
  button.removeAttribute('disabled');
  button.innerHTML = 'Upload';
  document.getElementById('progress').style.width = 0;
});
}

function doUpload (file, progressUpdate) {
  return axios({
    method: 'post',
    url: '/upload',
    data: file,
    responseType: 'text',
    onUploadProgress: progressUpdate
  });
}

function showLink (link) {
  const urlbox = document.getElementById('url-box');
  urlbox.value = link;
  urlbox.removeAttribute('style');
  alert('Unable to copy URL to clipboard!');
}
