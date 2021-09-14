import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as dataUri from '../src/dataUri.js';

const extract = suite('extract');
extract('returns empty array if not found uris', () => {
  assert.equal(dataUri.extract('some test text'), []);
});

extract('not contained uri at the begging of text', () => {
  assert.equal(
    dataUri.extract(
      'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=     '
    ),
    ['data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=']
  );
});

extract('uri contained in double quotes', () => {
  assert.equal(
    dataUri.extract(
      '"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="'
    ),
    ['data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=']
  );
});

extract('uri contained in single quotes', () => {
  assert.equal(
    dataUri.extract(
      "'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='"
    ),
    ['data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=']
  );
});

extract('multiple uris', () => {
  const text = `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=  

  background: url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>) center;

  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E">
  `;

  assert.equal(dataUri.extract(text), [
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
  ]);
});

extract.run();

const parse = suite('parse');

parse('svg', () => {
  assert.equal(
    dataUri.parse(
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
    ),
    {
      uri: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
      mediaType: 'image/svg+xml',
      isBase64: false,
      data: '<svg xmlns="http://www.w3.org/2000/svg"/>',
    }
  );
});

parse("doesn't care about media type params", () => {
  assert.equal(
    dataUri.parse(
      'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg"/>'
    ),
    {
      uri: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg"/>',
      mediaType: 'image/svg+xml',
      isBase64: false,
      data: '<svg xmlns="http://www.w3.org/2000/svg"/>',
    }
  );
});

parse('with base64', () => {
  assert.equal(
    dataUri.parse('data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='),
    {
      uri: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      mediaType: 'image/gif',
      isBase64: true,
      data: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    }
  );
});

parse.run();
