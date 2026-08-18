/* Claimed by a newly activated SW: force open tabs onto the new bundle.
   Old clients otherwise keep running cached JS until they close every tab. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url)
        }
      }
    })
  )
})
