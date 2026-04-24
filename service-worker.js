if (typeof importScripts === "function") {
  // eslint-disable-next-line no-undef
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    console.log("Workbox is loaded");
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    // eslint-disable-next-line no-restricted-globals
    workbox.precaching.precacheAndRoute([{"revision":"d41d8cd98f00b204e9800998ecf8427e","url":"App.css"},{"revision":"63e1a63cf8665b67128ea5621aea8ff2","url":"background-img blur.jpg"},{"revision":"22388760d10cec576a4248c0c64f14cf","url":"background-img.jpg"},{"revision":"69510c26ae96abe81c6c493dc944165e","url":"Haicoo.png"},{"revision":"667f418ae113ac42ef1b6f86adf78b84","url":"images/splashscreens/ipad_splash.png"},{"revision":"e4592a558a2d31f7fce26649396b8084","url":"images/splashscreens/ipadpro1_splash.png"},{"revision":"cfd9e51a33d323429d4a05b90a2a6d76","url":"images/splashscreens/ipadpro2_splash.png"},{"revision":"7d1c541215826102e98057cd693f785f","url":"images/splashscreens/ipadpro3_splash.png"},{"revision":"96b59d0179feec0f05af2467c1e0f64e","url":"images/splashscreens/iphone5_splash.png"},{"revision":"bd978af4c24bdf1c4a9e4ea31f04fcd1","url":"images/splashscreens/iphone6_splash.png"},{"revision":"ee1ea86b5a300542c6410683efefe69b","url":"images/splashscreens/iphoneplus_splash.png"},{"revision":"f827cb6a24f0331e77f28b33f6e239cb","url":"images/splashscreens/iphonex_splash.png"},{"revision":"a6c13c8aefca5a4336a06dee75d98a61","url":"images/splashscreens/iphonexr_splash.png"},{"revision":"313cb1b8771a36a74515138d8dd8b5d6","url":"images/splashscreens/iphonexsmax_splash.png"},{"revision":"4c2fdc7f5672dee09433ea005fd60b6f","url":"large.jpg"},{"revision":"d44e86be879e9a181d4cd726a0b8d6c3","url":"logo192.png"},{"revision":"88528c8886dbcce0603d0c7a4b20c8a5","url":"logo512.png"},{"revision":"658adf418051247e9d3ea6671f269d5e","url":"precache-manifest.658adf418051247e9d3ea6671f269d5e.js"},{"revision":"22388760d10cec576a4248c0c64f14cf","url":"small.jpg"},{"revision":"103e279a205c8273f6254f997b4fef2d","url":"static/css/2.fa349ff9.chunk.css"},{"revision":"e618f21d60093f32dbc883823b59ad0b","url":"static/css/main.d498bfb3.chunk.css"},{"revision":"c5d73a049b997bb74a1805b7f3ff4b34","url":"static/js/2.7efbe9ae.chunk.js"},{"revision":"b9ffba809b7a0347dc608e7270bcc8df","url":"static/js/main.2a223962.chunk.js"},{"revision":"715f89129992c28f1dd0391cc819bf0a","url":"static/js/runtime-main.dd87195f.js"},{"revision":"912ec66d7572ff821749319396470bde","url":"static/media/fontawesome-webfont.912ec66d.svg"},{"revision":"af7ae505a9eed503f8b8e6982036873e","url":"static/media/fontawesome-webfont.af7ae505.woff2"},{"revision":"fee66e712a8a08eef5805a46892932ad","url":"static/media/fontawesome-webfont.fee66e71.woff"},{"revision":"807cf025175fdcf8d9b358de97826171","url":"styles.css"},{"revision":"7985cb4389913b7caf36237decccc3c1","url":"sw.js"}]);

    /* custom cache rules */
    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: "PRODUCTION"
        })
      )
    );
  } else {
    // console.log('Workbox could not be loaded. No Offline support');
  }
}
