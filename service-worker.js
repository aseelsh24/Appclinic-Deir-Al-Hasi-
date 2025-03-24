// ملفات التخزين المؤقت
const CACHE_NAME = 'clinic-app-v1';
const urlsToCache = [
    '/',
    'index.html',
    'styles.css',
    'script.js'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// جلب الملفات من التخزين المؤقت
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});