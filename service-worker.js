var files = [
  'index.html',
  'manifest.json',
  'favicon.ico',
  'assets/images/image.png',
  'assets/css/style.css'
];


if (typeof files === 'undefined') {
  var files = [];
}

files.push('./');

var CACHE_NAME = 'static-v1';

self.addEventListener('activate', function (event) {
  console.log('[SW] Activate');

  event.waitUntil(
    caches.keys().then(function (cachesNames) {
      return Promise.all(
        cachesNames.map(function (cacheName) {
          if (CACHE_NAME.indexOf(cacheName) == -1) {
            console.log('[SW] Delete cache' + cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    })
  );
});

self.addEventListener('install', function (event) {
  console.log('[SW] install');

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        files.map(function (file) {
          return cache.add(file);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('[SW] fetch ' + event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request.clone());
    })
  );
});

selft.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event);
  clients.openWindow('/');
});
