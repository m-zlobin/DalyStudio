var CACHE_NAME = 'v2';
var urlsToCache = [];
var urlsToExclude = [
    
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v2').then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (e) {
    // Let the browser do its default thing
    // for non-GET requests.
    if (e.request.method !== 'GET' || urlsToExclude.some(url => e.request.url.includes(url))) { return; }

    var tryInCachesFirst = caches.open(CACHE_NAME).then(cache => {
        return cache.match(e.request).then(response => {
            if (!response) {
                return handleNoCacheMatch(e);
            }
            // Update cache record in the background
            fetchFromNetworkAndCache(e);
            // Reply with stale data
            return response;
        });
    });
    e.respondWith(tryInCachesFirst);
});

self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key !== CACHE_NAME)
                return caches.delete(key);
        }));
    }));
});

function fetchFromNetworkAndCache(e) {
    // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
    // There's probaly more going on here, but I'd rather just ignore this problem. :)
    // https://github.com/paulirish/caltrainschedule.io/issues/49
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

    return fetch(e.request).then(res => {
        // foreign requests may be res.type === 'opaque' and missing a url
        if (!res.url) return res;
        // regardless, we don't want to cache other origin's assets
        if (new URL(res.url).origin !== location.origin) return res;
        var responseClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
            // TODO: figure out if the content is new and therefore the page needs a reload.
            cache.put(e.request, responseClone);
        });
        return res;
    }).catch(err => console.error(e.request.url, err));
}

function handleNoCacheMatch(e) {
    return fetchFromNetworkAndCache(e);
}


