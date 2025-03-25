const CACHE_NAME = 'pwa-form-cache-v5';
const urlsToCache = [
    '/',
    '/index.html',
    '/trials.html',
    '/icons/pvs_logo_4.svg',
    '/static/css/style.css',
    '/static/fonts/Open_Sans/OpenSans-VariableFont_wdth_wght.ttf',
    '/static/js/app.js',
    '/static/js/confetti.js',
    '/static/js/form.js',
    '/static/js/trials.js',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});
