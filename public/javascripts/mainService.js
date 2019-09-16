if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope))
    .catch(err => console.log('ServiceWorker registration failed: ', err))
}

if (navigator.geolocation) {
  console.log('Geolocation is supported!')
} else {
  console.log('Geolocation is not supported for this Browser/OS version yet.')
}
