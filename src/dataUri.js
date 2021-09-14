function getEndCharacter(startCharacter) {
  if (startCharacter === '[') return ']';
  if (startCharacter === '(') return ')';
  if (startCharacter === '<') return '>';
  if (startCharacter === null) return '\n';
  if (startCharacter === '\n') return '\n';

  return startCharacter;
}

function extract(str) {
  // data-uri scheme
  // data:[<media type>][;charset=<character set>][;base64],<data>
  const shortestUrl = 'data:z';
  if (str.length < shortestUrl.length) {
    return [];
  }

  const STATE_SEARCH = 0;
  const STATE_FILL = 1;

  let result = [];
  let endCharacter;
  let state = STATE_SEARCH;
  let uri = '';

  for (let i = 0; i < str.length; i++) {
    switch (state) {
      case STATE_SEARCH:
        if (str.substr(i, 5) === 'data:') {
          const startCharacter = i - 1 < 0 ? null : str[i - 1];
          endCharacter = getEndCharacter(startCharacter);
          i--;
          state = STATE_FILL;
        }
        break;

      case STATE_FILL:
        if (str[i] === endCharacter || i === str.length - 1) {
          result.push(uri.trim());
          uri = '';
          state = STATE_SEARCH;
        } else {
          uri = uri + str[i];
        }
        break;

      default:
        break;
    }
  }

  return result;
}

function parse(datauri) {
  const pattern = /(data:(.+?)(?:;.+=.+?)?(;base64)?,(.+))/i;

  const match = pattern.exec(datauri);
  if (!match) {
    return null;
  }

  return {
    uri: match[1],
    mediaType: match[2],
    isBase64: match[3] ? true : false,
    data: match[4],
  };
}

export { extract, parse };
