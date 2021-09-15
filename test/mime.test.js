import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as mime from '../src/mime.js';

const getExtension = suite('getExtension');

getExtension('from mime-db', () => {
  assert.is(mime.getExtension('font/woff2'), 'woff2');
});

getExtension('from custom extensions list', () => {
  assert.is(mime.getExtension('application/font-woff2'), 'woff2');
});

getExtension('from custom extensions list with weird case', () => {
  assert.is(mime.getExtension('Application/Font-Woff2'), 'woff2');
});

getExtension('for unknown mime type returns .bin', () => {
  assert.is(mime.getExtension('application/unknown'), 'bin');
});

getExtension.run();
