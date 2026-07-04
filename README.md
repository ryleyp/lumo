# Lumo

Lumo is a static, on-device film preset editor.

- Desktop: `index.html`
- Mobile/PWA: `mobile.html`
- AI subject masking runs in the browser with the bundled MediaPipe model in `vendor/`.
- HEIC decoding uses the bundled `heic2any.min.js` file.
- No paid API, backend, or server-side processing is required.
- Desktop and mobile export full-resolution edits by default. JPEG uses maximum quality, and PNG export is available for lossless saves.
- Use Best quality for a one-tap PNG lossless export. Lumo warns before saving when export dimensions do not match the imported photo.
- Mobile previews use a smaller working image for speed, but export renders from the original decoded photo at original dimensions unless a social export size is selected.
- Mobile saved presets are stored in the browser on that device, and subject-mask blur runs on-device.

## GitHub Pages

After GitHub Pages is enabled for this repository:

- Desktop: `https://ryleyp.github.io/lumo/`
- Mobile: `https://ryleyp.github.io/lumo/mobile.html`

On iPhone, open the mobile URL in Safari, then use Share -> Add to Home Screen.
