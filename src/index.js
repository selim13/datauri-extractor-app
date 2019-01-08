import mimeTypes from 'mime-types';
import md5 from 'crypto-js/md5';
import hex from 'crypto-js/enc-hex';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import 'normalize.css';
import './style.css';
import exampleURL from './example.css.txt';

const input = document.querySelector('.css-input');
const results = document.querySelector('.results');
const zipBtn = document.querySelector('.zip');
const exampleBtn = document.querySelector('.example-button');

let zip;

exampleBtn.addEventListener('click', e => {
  e.preventDefault();
  fetch(exampleURL)
    .then(res => res.text())
    .then(data => {
      input.value = data;
      handleInput(data);
    });
});

input.addEventListener('input', e => handleInput(e.target.value));
handleInput(input.value);

zipBtn.addEventListener('click', () => {
  if (!zip) return;

  zip.generateAsync({ type: 'blob' }).then(function(blob) {
    saveAs(blob, 'dataurl-bundle.zip');
  });
});

function getURIs(code) {
  const pattern = /url\(['"]?(data:(.+?)(?:;.+?)?(;base64)?,(.+))['"]?\)/gi;

  const result = [];
  let match;
  while ((match = pattern.exec(code))) {
    result.push({
      uri: match[1],
      mediaType: match[2],
      isBase64: match[3] ? true : false,
      data: match[4]
    });
  }

  return result;
}

function handleInput(value) {
  results.innerHTML = '';

  const files = getURIs(value);
  zip = new JSZip();

  files.forEach(file => {
    const data = file.isBase64 ? new Buffer(file.data, 'base64') : file.data;
    const extension = mimeTypes.extension(file.mediaType)
      ? mimeTypes.extension(file.mediaType)
      : 'bin';
    const hash = hex.stringify(md5(data));
    const blob = new Blob([data], { type: file.mediaType });
    const fileName = `${hash}.${extension}`;

    zip.file(`dataurl/${fileName}`, data);

    let img =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z'/%3E%3C/svg%3E";

    if (['woff', 'woff2', 'ttf', 'eot'].includes(extension))
      img =
        "data:image/svg+xml,%3Csvg baseProfile='tiny' xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3Cpath d='M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z'/%3E%3C/svg%3E";

    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(extension))
      img = file.uri;

    const figure = document.createElement('figure');
    figure.classList.add('results__item');
    figure.insertAdjacentHTML(
      'beforeend',
      `<img src="${img}" alt="" title="${fileName}">
    <div class="results__item-type">${extension}</div>
    `
    );

    figure.addEventListener('click', () => saveAs(blob, fileName));
    results.appendChild(figure);
  });

  if (files.length > 0) zipBtn.classList.remove('hidden');
  else zipBtn.classList.add('hidden');
}
