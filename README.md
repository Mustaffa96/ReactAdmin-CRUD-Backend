# ReactAdmin-FullStack-CRUD

## Project Setup (Backend)

Before we begin, make sure to have globally installed Node.js on your machine, this is crucial to import all our dependencies and set up both the backend and the frontend projects. Also, I will use a local instance of MongoDB for the database, but you can also use a free cluster hosted on MongoDB Atlas.

So, in order to setup the backend side, let’s create a new folder for the project, install our dependencies and set up the structure. In your terminal:

```
mkdir notes-server
cd notes-server
npm init -y
npm install fastify
npm install @types/node
npm i -D nodemon
npm i -D ts-node
mkdir src or create manually src folder
touch src/index.ts or cd src
```

So, line by line: (1) we created a notes-backend folder, (2) entered the folder, (3) initialized a Node project, (4) installed Fastify and Mongoose as dependencies, (5)created a new src folder with (6) an index.js file which will be the root for our application.

Connection to MongoDB and app running

Now, let’s get the Fastify app running together with the MongoDB connection. So, in the index.ts file we just created:

```
// Import fastify & mongoose
import fastify from 'fastify';
import mongoose from 'mongoose';

// Initialize Fastify App
const app = fastify();

// Connect fastify to mongoose
try {
  mongoose.connect('mongodb://localhost:27017/notes_db');
} catch (e) {
  console.error(e);
}

// Handle root route
app.get('/', async (request, reply) => {
  try{
    reply.send("Hello world!");
  } catch(e) {
    console.error(e);
  }
})

// Set application listening on port 5000 of localhost
app.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});

```

We imported fastify and mongoose and initialized the app by calling the fastify function. The mongoose.connect function let us specify a mongoUri to connect our database to the app, so I put my local port 27017, where my MongoDB instance is running(if you are using a cluster in MongoDB Atlas, you can find your mongoUri in the connection section, but remember to list your ip address into the whitelist of allowed connections.). At the veryend of the mongoUri, you can specify the name of the db for the project. In my case, I called it notes_db. You can call it whatever you want, if a database with that name does not exist in your MongoDB instance, Mongoose will create it for you!

We then handle the root route of our application with the app.get function. This handles a GET request on the root (‘/’) address of our app. When we want to handle a route on a Fastify App, we need to provide a function with the request and reply parameters. As you may guess, the former contains all the information related to the request while the latter is meant for us to return a proper reply to the endpoint. For now, we just reply.send() a simple string.

Finally, the the app.listen function sets our application listening to the port 3000. Let’s now put it to the test. To do so, first open the package.json file in the root of our applicaion and add the following “start” script inside the scripts object:

```
"scripts": {
    "start": "ts-node src/index.ts",
 },
```

If you now run npm start from your terminal you should see a message saying “Server running on http://127.0.0.1:3000”. Open your browser at http://localhost:3000 and you should see our “Hello world!” string, meaning our app is running successfully!

## Defining the Note Schema

At this point, we want to have a notes collection inside our database, and we also need to define the properties that a note document should have. We do so by creating a Note Model and providing a Model Schema, that is, an object with all the specification for a typical note document. Let’s create a new folder and file inside our project; in your project folder terminal:

```
mkdir src/models or New-Item -ItemType Directory -Force -Path src/models
touch src/models/Note.ts or New-Item -ItemType File -Force -Path src/models/Note.ts
```

Let’s edit this new file as follows:

```
import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface INote extends Document {
  text: string;
}

const noteSchema: Schema = new Schema({
  text: { type: String, required: true },
});

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;

```

Basically we are using Mongoose’s Schema object to explicitely declare to our MongoDB that our notes will have a mandatory propery called text, which is, naturally, a string. We are then defining it as a model with the mongoose.model function. The first parameter is a string that will be used by mongo to define the name of the collection: given a “note” model, we will find a “notes” collection in our database after our very first operation with a Note. Finally, we export the newly created Note model and make it available throughout the application.

## Defining API Routes (Endpoints)

Inside of our src folder, we will now create a new routes folder, with a noteRoutes.js file in it. So in the terminal, let’s type this:

```
mkdir src/routes
touch src/routes/noteRoutes.ts or New-Item -ItemType File -Force -Path src/routes/noteRoutes.ts
```

Within this file, we will export a function whose only parameter will be the entire fastify app, and whose return value is a list of routes to be added to the app itself. For each route, we specify the HTTP verb to be handled, a url, and, finally a handler function, that we will define in a second step.

```
import { FastifyInstance } from 'fastify';

export default async function noteRoute(app: FastifyInstance) {
  // create a note
  app.post('/api/notes', async (request, reply) => {
    // Your code here
  });

  // get the list of notes
  app.get('/api/notes', async (request, reply) => {
    // Your code here
  });

  // get a single note
  app.get('/api/notes/:id', async (request, reply) => {
    // Your code here
  });

  // update a note
  app.put('/api/notes/:id', async (request, reply) => {
    // Your code here
  });

  // delete a note
  app.delete('/api/notes/:id', async (request, reply) => {
    // Your code here
  });
}

```

We can now perform:

*A POST call to `api/notes` to Create a note
*A GET call to `api/notes` to get the List of all of our notes
*A GET call to `/api/notes:id` to retreive a single note
*A PUT call to `/api/notes:id` to Update a given note
\*A DELETE call to `/api/notes:id` to Delete a specific note

The `:id` is obvously a placeholder for the id of our document, and we will be able to access it inside the request params of our route handler function as `request.params.id` . (We’ll take care of the handlers in the next section).

As shown in the file above, we need to have access to the app object in order to call the route handlers on it, therefore, we must import this file into our index.js and call it with the fastify app as its parameter:

```
import fastify from 'fastify';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes';

const app = fastify();

try {
  mongoose.connect('mongodb://localhost:27017/notes_db');
} catch (e) {
  console.error(e);
}

noteRoutes(app);

app.listen(5000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});

```

## Moving API Route Handlers (Controller)

Now that we have our routes, we need to define our handlers for each of the routes. For the sake of cleaninless, we will move our handler functions in an external file, where we will define the logics and from which we will export and assign them to their respective routes. We refer at such files as controllers. So, as a first step, let’s create a controllers folder in our src and inside of it, let’s add a new file named notesController.js. As usual, inside the project root folder let’s open our terminal and type:

```
mkdir src/controllers
touch src/controllers/notesController.ts or New-Item -ItemType File -Force -Path src/controllers/notesController.ts
```

Let’s now work on the newly created controller, notesController.ts :

```
import { FastifyReply, FastifyRequest } from 'fastify';
import Note from '../models/note';

interface NoteController {
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  fetch(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  get(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  update(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  delete(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

const noteController: NoteController = {
  //# create a note
  create: async (request: FastifyRequest, reply: FastifyReply) => {},

  //#get the list of notes
  fetch: async (request: FastifyRequest, reply: FastifyReply) => {},

  //#get a single note
  get: async (request: FastifyRequest, reply: FastifyReply) => {},

  //#update a note
  update: async (request: FastifyRequest, reply: FastifyReply) => {},

  //#delete a note
  delete: async (request: FastifyRequest, reply: FastifyReply) => {},
}

export default noteController;

```

As a first thing, we are importing our Note model, which will be used to perform operations against our database thanks to Mongoose methods. We have then defined a function for each of the operation, and mark them as asyncronous, since our database will need some amount of time to complete its processing, and we will need to wait for it.

Let’s leave the actual implementation of the handlers for later and let’s just connect our route file with these newly decleared functions. Inside `notesRoutes.ts`, we import the controller and assign the respective functions:

```
import { FastifyInstance } from 'fastify';
import notesController from '../controllers/notesController';

export default (app: FastifyInstance) => {
  //# create a note
  app.post('/api/notes', notesController.create);

  //#get the list of notes
  app.get('/api/notes', notesController.fetch);

  //#get a single note
  app.get('/api/notes/:id', notesController.get);

  //#update a note
  app.put('/api/notes/:id', notesController.update);

  //#delete a note
  app.delete('/api/notes/:id', notesController.delete);
};
```

## Defining Route HandlerFunctions

Let’s now focus on each of our handler functions inside noteControllers.ts.

### Create a note

In order to create a note the first thing we need to do is to extract the information about the new note we are supposed to create from the body of the request. After that, we will use Mongoose’s create method, which will create a new document and return it back to us. We are then ready to set the proper HTTP status (201) and to return our brand new note, as requested by REST conventions:

```
//# create a note
create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const note = request.body as any;
      const newNote = await Note.create(note);
      reply.code(201).send(newNote);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
```

### Get the list of the notes

This is probably the easisest one, we will receive our GET call and we will use the find method on our Note model, providing an empty object as a parameter. The first parameter could contain a MongoDB query object to specify some critera about which notes to get. Thus, the empty object will return all of the notes in the collection. We can then send them back in our response:

```
fetch: async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const notes = await Note.find({});
      reply.code(200).send(notes);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
```

### Get a single note

This time around our first step will be to get the id of the note we want to retreive from the request url. When we define plaeholders inside the route url,(such as we did with the :id in our routes) they will be available for us inside the request.params object. Once we get the id we are finally able to invoke the findById metod on the Note model and retreive the desired note by passing the id as the only parameter.

```
get: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const noteId = (request.params as any).id;
      const note = await Note.findById(noteId);
      reply.code(200).send(note);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
```

### Update a note

The update requires us to take both the body of the request and the id from the url. The body, will contain the note properties that need to be modified, while the id will be necessary to identify which note to update. With these two pieces of information at our disposal, we can use the findByIdAndUpdate method, passing the id of the note as a first argument, and the data coming from the body as the second one.

Unlike the create, find, and findById methods, findByIdAndUpdate does not return the updated object, forcing us to fetch the database again in order to send the freshly modified note back as a response.

Note: we return the response inside the data property of an object because React Admin requires it in its documentation.

```
update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const noteId = (request.params as any).id;
      const updates = request.body as any;
      await Note.findByIdAndUpdate(noteId, updates);
      const noteToUpdate = await Note.findById(noteId);
      reply.code(200).send({ data: noteToUpdate });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
```

### Delete a note
Our last handler will take care of the cancellation of a note. No body required here, we just need the get the id from the url as usual and pass it to the findByIdAndDelete method. As you would expect, this method cannot return from the database an object who has just been deleted, so in this case, we will have to retreive the note before deleting it. We can do it similarly to what we did earlier in the “get single note” handler:

```
delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const noteId = (request.params as any).id;
      const noteToDelete = await Note.findById(noteId);
      await Note.findByIdAndDelete(noteId);
      reply.code(200).send({ data: noteToDelete });
    } catch (e) {
      reply.code(500).send(e);
    }
  },
```

## One last step
We successfully managed to set up all our API endpoints, but we haven’t finished yet. In order to make React Admin and our backend working properly together, we need to make sure to include a particular header every time our endpoints send back a response.

### The Content-Range header
According to React Admin offical docs, the package relies on the Content-Range header to properly manage and display the pagination of its tables.This is what React admin expects to find in the header:

```
Content-Range: posts 0-24/319
```

The value represents the name of the collection, followed by the number of items displayed and the total number of documents inside the collection.

### Fastify preHandler hook
So the question is: how do we do that? And the answer is: with a hook!

Fastify hooks, are functions we can use to set some custom code in given moments of the workflow of our application. There are many type of hooks that can be invoked with fastify’s addHook function. Let’s define a hook inside a new folder! In the terminal:

```
mkdir src/hooks
touch src/hooks/contentRangeHook.ts or New-Item -ItemType File -Force -Path src/hooks/contentRangeHook.ts
```

Before working on its logic, we import this file inside index.js, just before our routes:

```
//index. js
const app = fastify();
const fastify = require('fastify');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/noteRoutes');
const contentRangeHook = require('./hooks/contentRangeHook');
try {
  mongoose.connect('mongodb://localhost:27017/notes_db');
} catch (e) {
  console.error(e);
}
app.addHook('preHandler', contentRangeHook);
noteRoutes(app);
app.listen(5000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});
```

As you see in the highlighted line above, addHook recevies the type of hook as a string in its first parameter (the complete list of the hooks is here), and the hook function itself, in the second.

In order to manipulate the reply object of our endpoints, we need to use the preHandler hook, which receives as parameters both the request and the reply objects, plus the next function, that we are supposed to call at the end, letting fastify know that we finished our logics and natural flow of the app can go on.

```
import Note from '../models/Note';

export default (request: any, reply: any, done: () => void) => {
  Note.countDocuments({}, (err: Error, count: number) => {
    if (err) {
      console.error(err);
      reply.code(500).send('Error!');
    }
    reply.header('Content-Range', `notes 0-${count}/${count}`);
    done();
  });
};

```

In order to provide the proper information to React Admin inside our Content-Range header, we want to at least get the real number of documents inside of our collection. To do so, we can use Mongoose’s count method. As we did with the find method before, we provide an empty object as a query, without specifying any filter criteria (it’s a test app after all!).

Once we obtained this information, we can prepare the Content-Range header string: we specified notes as item names, set the pagination and interpolated the total number of documents at the end of the string.

We are now ready to use the reply.header setter method, to specify the name of the header and its content. Accomplished the hook task, we can call next()!

Note: the pagination was arbitrarily set to a maximum of 10 notes for no particular reason.

Congrats!
That’s it for the first part! We put our backend in place, set up our routes, manipulated our header to work fine with React Admin and we are now ready to build the frontend in part 2!