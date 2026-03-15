self.addEventListener('install', event => {
  console.log('Service Worker installiert')
  self.skipWaiting()
})

self.addEventListener('fetch', event => {
  // einfach weiterleiten, minimal für PWA
  event.respondWith(fetch(event.request))
})