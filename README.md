# LinkDrop

A React app built with Vite.

## Getting started

```sh
npm install
npm run dev
```

## Available scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build in `dist`.
- `npm run extension:dev` builds the unpacked extension in `dist-extension-dev` and watches for changes.
- `npm run extension:build` creates a production unpacked extension in `dist-extension`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks the source with Oxlint.

To load the extension in Chrome, run `npm run extension:build`, open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, and choose the `dist-extension` folder. Click the LinkDrop toolbar button to open its side panel. For development, run `npm run extension:dev` and load `dist-extension-dev` instead.
