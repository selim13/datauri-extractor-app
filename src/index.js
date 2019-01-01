import mimeTypes from 'mime-types';
import md5 from 'crypto-js/md5';
import hex from 'crypto-js/enc-hex';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import 'normalize.css';
import './style.css';

const input = document.querySelector('.css-input');
const results = document.querySelector('.results');
const zipBtn = document.querySelector('.zip');

document.addEventListener('input', e => handleInput(e.target.value));

function decode(dataURI) {
  const matches = dataURI.match(/data:(image\/.+);base64,(.+)/);
  return {
    type: matches[1],
    data: new Buffer(matches[2], 'base64')
  };
}

function handleInput(value) {
  results.innerHTML = '';
  const zip = new JSZip();

  const pattern = /url\(['"]?(.+)['"]?\)/g;
  let match;
  while ((match = pattern.exec(value))) {
    const dataBase64 = match[1];
    const dataHash = hex.stringify(md5(dataBase64));
    const decoded = decode(dataBase64);
    const extension = mimeTypes.extension(decoded.type);
    const blob = new Blob([decoded.data], { type: decoded.type });
    const fileName = `${dataHash}.${extension}`;

    zip.file(`dataurl/${fileName}`, decoded.data);

    const figure = document.createElement('figure');
    figure.classList.add('results__item');
    figure.insertAdjacentHTML(
      'beforeend',
      `<img src="${dataBase64}">
      <figcaption>${fileName}</figcaption>`
    );

    figure.addEventListener('click', () => saveAs(blob, fileName));

    results.appendChild(figure);
  }

  zipBtn.addEventListener('click', () => {
    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      saveAs(blob, 'dataurl-bundle.zip');
    });
  });
}
