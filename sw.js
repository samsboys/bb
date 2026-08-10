const CACHE_NAME = "bukbu-electronic-card-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


/* 설치 */

self.addEventListener("install", function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME).then(function(cache) {

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  self.skipWaiting();

});


/* 활성화 */

self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys().then(function(keys) {

      return Promise.all(

        keys.map(function(key) {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })

      );

    })

  );

  self.clients.claim();

});


/* 인터넷 우선 */

self.addEventListener("fetch", function(event) {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(function(response) {

        const copy = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });

        return response;

      })

      .catch(function() {

        return caches.match(event.request);

      })

  );

});
