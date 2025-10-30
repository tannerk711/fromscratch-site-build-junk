import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Dmp625Xg.mjs';
import { manifest } from './manifest_DtZCywqZ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/estimate.astro.mjs');
const _page2 = () => import('./pages/api/save-lead.astro.mjs');
const _page3 = () => import('./pages/api/send-email.astro.mjs');
const _page4 = () => import('./pages/quote/success.astro.mjs');
const _page5 = () => import('./pages/quote.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/estimate.js", _page1],
    ["src/pages/api/save-lead.js", _page2],
    ["src/pages/api/send-email.js", _page3],
    ["src/pages/quote/success.astro", _page4],
    ["src/pages/quote.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a59edc30-7fab-423b-b364-8fd756be2581",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
