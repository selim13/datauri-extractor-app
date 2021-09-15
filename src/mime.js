import mime from 'mime';

/**
 * Return file extension associated with a mime type, bin if unknown.
 *
 * @param {string} mimeType
 * @returns {string}
 */
function getExtension(mimeType) {
  const customExtensions = {
    'application/font-woff': 'woff',
    'application/font-woff2': 'woff2',
  };

  return (
    mime.getExtension(mimeType) ??
    customExtensions[mimeType.toLowerCase()] ??
    'bin'
  );
}

export { getExtension };
