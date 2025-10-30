import { o as decodeKey } from './chunks/astro/server_C2P1oOug.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C83wnt-y.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/","cacheDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/node_modules/.astro/","outDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/dist/","srcDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/src/","publicDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/public/","buildClientDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/dist/client/","buildServerDir":"file:///C:/Users/tanne/Downloads/From%20Scratch%20Junk%20Site/fromscratch-site-build-junk/junk-hauler-site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"quote/success/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/quote/success","isIndex":false,"type":"page","pattern":"^\\/quote\\/success\\/?$","segments":[[{"content":"quote","dynamic":false,"spread":false}],[{"content":"success","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/quote/success.astro","pathname":"/quote/success","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"quote/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/quote","isIndex":false,"type":"page","pattern":"^\\/quote\\/?$","segments":[[{"content":"quote","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/quote.astro","pathname":"/quote","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/estimate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/estimate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"estimate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/estimate.js","pathname":"/api/estimate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/save-lead","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/save-lead\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"save-lead","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/save-lead.js","pathname":"/api/save-lead","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/send-email","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/send-email\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"send-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/send-email.js","pathname":"/api/send-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/tanne/Downloads/From Scratch Junk Site/fromscratch-site-build-junk/junk-hauler-site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/tanne/Downloads/From Scratch Junk Site/fromscratch-site-build-junk/junk-hauler-site/src/pages/quote.astro",{"propagation":"none","containsHead":true}],["C:/Users/tanne/Downloads/From Scratch Junk Site/fromscratch-site-build-junk/junk-hauler-site/src/pages/quote/success.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/estimate@_@js":"pages/api/estimate.astro.mjs","\u0000@astro-page:src/pages/api/save-lead@_@js":"pages/api/save-lead.astro.mjs","\u0000@astro-page:src/pages/api/send-email@_@js":"pages/api/send-email.astro.mjs","\u0000@astro-page:src/pages/quote/success@_@astro":"pages/quote/success.astro.mjs","\u0000@astro-page:src/pages/quote@_@astro":"pages/quote.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DtZCywqZ.mjs","C:/Users/tanne/Downloads/From Scratch Junk Site/fromscratch-site-build-junk/junk-hauler-site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BDOovkQw.mjs","C:/Users/tanne/Downloads/From Scratch Junk Site/fromscratch-site-build-junk/junk-hauler-site/src/components/lead-form/MultiStepForm":"_astro/MultiStepForm._eyn-2hh.js","@astrojs/react/client.js":"_astro/client.B_PwMJWB.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.DToGTOun.css","/_astro/quote.D27E_wyY.css","/favicon.svg","/images/appliance-staging.jpg","/images/boise-downtown-skyline.jpg","/images/commercial-building.jpg","/images/construction-debris-trucks.jpg","/images/estate-elegant-room.jpg","/images/estate-furnished-room.jpg","/images/hero-caldwell (1).jpg","/images/hero-caldwell.jpg","/images/hero-commercial.jpg","/images/hero-construction.jpg","/images/hero-eagle.jpg","/images/hero-emmett (1).jpg","/images/hero-emmett.jpg","/images/hero-furniture (1).jpg","/images/hero-garden-city.jpg","/images/hero-home.jpg","/images/hero-kuna (1).jpg","/images/hero-kuna.jpg","/images/hero-meridian.jpg","/images/hero-middleton (1).jpg","/images/hero-middleton.jpg","/images/hero-nampa (1).jpg","/images/hero-nampa.jpg","/images/hero-residential.jpg","/images/hero-star (1).jpg","/images/hero-star.jpg","/images/hero-storage.jpg","/images/hero-yard (2).jpg","/images/hero-yard.jpg","/images/residential-junk-removal.jpg","/images/storage-facility.jpg","/images/suburban-neighborhood.jpg","/images/yard-debris-piles.jpg","/_astro/client.B_PwMJWB.js","/_astro/index.Be8AcK8B.js","/_astro/MultiStepForm._eyn-2hh.js","/quote/success/index.html","/quote/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"Fy8efkQ/IUesGZtdQMg6Oq9O/xmlyndXVQhDuYP5tWc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
