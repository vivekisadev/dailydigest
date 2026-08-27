self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Task Reminder', body: event.data.text() || 'You have a pending task.' };
  }
  
  const options = {
    body: data.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    requireInteraction: true,
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
