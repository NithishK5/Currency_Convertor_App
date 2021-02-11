'use strict';
/*global self, caches */

const CACHE_NAME = "cache-1.1";

self.addEventListener('install', function (e) {
    console.log("Worker: install event in progress");
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/index.html',
                '/assets/css/normalize.css',
                '/assets/css/style.css',
                "/assets/image/icon.png",
                '/assets/js/Model.js',
                '/assets/js/View.js',
                '/assets/js/Controller.js',
            ]);
        }).then(_ => {
            console.log("Worker: install completed");
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME)
            .then(cache => cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                return response || fetch(event.request);
            })
    );
});