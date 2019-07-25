var urlsToCache_ = [
  '/',
  '/views/student/student_home.hbs',
  '/views/homefile/home.hbs',
  '/views/homefile/history.hbs',
  '/views/homefile/libraryinfo.hbs',
  '/views/homefile/objectives.hbs',
  '/views/homefile/aboutus.hbs',
  '/views/homefile/orientation.hbs',
  '/views/homefile/examination.hbs',
  '/views/homefile/guidelines.hbs',
  '/views/homefile/100levelcourse.hbs',
  '/views/homefile/200levelcourse.hbs',
  '/views/homefile/300levelcourse.hbs',
  '/views/homefile/400levelcourse.hbs',
  '/stylesheets/main.css',
  '/images/psylogo4.jpg',
  '/images/ballot.jpeg',
  '/images/agbor.png',
  '/images/uwaoma.png',
  '/images/unnamed.png',
  '/images/unnamed(1).png',
  '/images/unnamed(2).png',
  '/images/Sir Rich.jpg',
  '/images/Ethelbert.png',
  '/images/cartoon_election.jpg',
  '/images/cartoon_ballot.jpg',
  '/images/images (1).jpeg',
  '/images/images (8).jpeg',
  '/images/images (11).jpeg',
  '/images/images (12).jpeg',
  '/images/images (14).jpeg',
  '/images/images (15).jpeg',
  '/images/images (16).jpeg',
  '/images/images (17).jpeg',
  '/images/images (18).jpeg',
  '/images/images (19).jpeg',
  '/images/images (20).jpeg',
  '/images/images (22).jpeg',
  '/images/images (23).jpeg',
  '/images/images (24).jpeg',
  '/images/images (25).jpeg',
  '/images/images (26).jpeg',
  '/images/images (27).jpeg',
  '/images/images (28).jpeg',
  '/images/images (29).jpeg',
  '/images/images (30).jpeg',
  '/javascripts/mainService.js',
  '/manifest.json'
]

var version = 'v15'

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installed version', version)
  event.waitUntil(
    caches.open(version)
      .then(function (cache) {
        console.log('opened cache')
        return cache.addAll(urlsToCache_)
      })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', function (event) {
  var cacheWhitelist = [version]

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (version && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleted old cache')
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
