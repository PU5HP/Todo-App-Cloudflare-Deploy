// Import the necessary types from the Cloudflare Workers API
import { Router,json} from 'itty-router';
import { insertUser,insertTodo,getUser,getTodos,updateUser } from './routes';
//const { json } = require('itty-router-parser');
// Define the request handler function
const app = Router();
interface UserRequestBody {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	email: string;
}
async function handleRequest(request: Request) {
  // Create a new instance of the Router
  // Define the route for GET requests to '/xxx'
  app.get('/', (_req: Request) => {
    // Create a new Response with the desired text content
    return new Response("App-todo", {
      headers: { 'Content-Type': 'text/plain' },
    });
  });
  app.post('/todos/:id', json, async ({ request, params }) => {
    try {
        const requestBody = await request.json();

        const todoCreated = await insertTodo(
            requestBody.title,
            requestBody.description,
            requestBody.done,
            parseInt(params.id)
        );

        const response = new Response(JSON.stringify({ message: 'Todo Created Successfully' }), {
            status: 201
        });
				console.log(response); // Logging the response
				return response;
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});
	app.post('/signup', json, async (request) => {
		try {
			const requestBody = await request.json();
			if (isValidUserRequestBody(requestBody)) {
				const userCreated = await insertUser(
						requestBody.username,
						requestBody.password,
						requestBody.firstName,
						requestBody.lastName,
						requestBody.email
				);

			if (userCreated !== null) {
				return new Response("user-created-successfully", {
					headers: { 'Content-Type': 'text/plain' },
				});
			} else {
					return new Response(JSON.stringify({ message: 'User with this username or email already exists' }), {
							status: 400,
							headers: { 'Content-Type': 'application/json' }
					});
			}}
	} catch (error) {
			return new Response(JSON.stringify({ message: 'Internal server error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
			});
	}
});
app.get('/info/:username', async ({ params, response }) => {
	try {
			const info = await getUser(params.username);
			return new Response(JSON.stringify({ info }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' }
			});
	} catch (error) {
			return new Response(JSON.stringify({ message: 'Internal server error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
			});
	}
});


app.put('/user/:username', async ({ params, request, response }) => {
	try {
			const requestBody = await request.json();
			const { firstName, lastName } = requestBody;
			const updateResponse = await updateUser(params.username, firstName, lastName);

			if (updateResponse !== null) {
					return new Response("user-created-successfully", {
							headers: { 'Content-Type': 'text/plain' },
					});
			} else {
					return new Response(JSON.stringify({ message: 'User with this username or email already exists' }), {
							status: 400,
							headers: { 'Content-Type': 'application/json' }
					});
			}
	} catch (error) {
			return new Response(JSON.stringify({ message: 'Internal server error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
			});
	}
});

app.get('/todos/:id', async ({ params, response }) => {
	try {
			const todoId = parseInt(params.id);
			const todos = await getTodos(todoId);
			return new response(JSON.stringify({ todos }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' }
			});
	} catch (error) {
			return new response(JSON.stringify({ message: 'Internal server error' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
			});
	}
});

  // Handle the request using the Router instance
  return app.handle(request);
}
function isValidUserRequestBody(body: any): body is UserRequestBody {
	return (
			typeof body === 'object' &&
			typeof body.username === 'string' &&
			typeof body.password === 'string' &&
			typeof body.firstName === 'string' &&
			typeof body.lastName === 'string' &&
			typeof body.email === 'string'
	);
}
// Add an event listener for fetch events
addEventListener('fetch', (event: FetchEvent) => {
  // Call the handleRequest function when a fetch event occurs
  event.respondWith(handleRequest(event.request));
});
