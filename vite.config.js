import viteCompression from 'vite-plugin-compression';

const compressFilter = /\.(js|mjs|json|css|html|txt|svg|xml)$/i;

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    viteCompression({ algorithm: 'gzip', ext: '.gz', filter: compressFilter }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: compressFilter,
    }),
  ],
};

export default config;
