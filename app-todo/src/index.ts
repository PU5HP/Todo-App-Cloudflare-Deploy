// Import the necessary types from the Cloudflare Workers API
import { Router} from 'itty-router';

// Define the request handler function
async function handleRequest(request: Request) {
  // Create a new instance of the Router
  const app = Router();

  // Define the route for GET requests to '/xxx'
  app.get('/xxx', (_req: Request) => {
    // Create a new Response with the desired text content
    return new Response("TypeScript With Express", {
      headers: { 'Content-Type': 'text/plain' },
    });
  });

	app.get('/xx1x', (_req: Request) => {
    // Create a new Response with the desired text content
    return new Response("TypeScript With asExpress", {
      headers: { 'Content-Type': 'text/plain' },
    });
  });

  // Handle the request using the Router instance
  return app.handle(request);
}

// Add an event listener for fetch events
addEventListener('fetch', (event: FetchEvent) => {
  // Call the handleRequest function when a fetch event occurs
  event.respondWith(handleRequest(event.request));
});
