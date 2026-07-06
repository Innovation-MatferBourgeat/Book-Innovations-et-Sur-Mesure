// ── Matfer Bourgeat Product Book — Service Worker (Cache-on-demand) ──
var CACHE = 'mb-book-v1';

// Resources to pre-cache on install (the shell)
var SHELL = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400&display=swap'
];

// ── Install: cache the app shell ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(SHELL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate: clean up old caches ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch: network-first for API, cache-first for assets ──
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // GitHub API calls: network-first, fall back to cache
  if (url.indexOf('api.github.com') >= 0) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        // Cache a clone of the successful response
        var clone = res.clone();
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        return res;
      }).catch(function() {
        // Offline: serve from cache
        return caches.match(e.request).then(function(cached) {
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'offline', tree: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Raw GitHub images & files: cache-first, network fallback
  if (url.indexOf('raw.githubusercontent.com') >= 0) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request).then(function(res) {
          if (res.ok) {
            var clone = res.clone();
            caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
          }
          return res;
        });
      })
    );
    return;
  }

  // Google Fonts & everything else: cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(res) {
        if (res.ok && e.request.method === 'GET') {
          var clone = res.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});
