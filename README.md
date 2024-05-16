# ReactAdmin-FullStack-CRUD

## Project Setup (Backend)
Before we begin, make sure to have globally installed Node.js on your machine, this is crucial to import all our dependencies and set up both the backend and the frontend projects. Also, I will use a local instance of MongoDB for the database, but you can also use a free cluster hosted on MongoDB Atlas.

So, in order to setup the backend side, let’s create a new folder for the project, install our dependencies and set up the structure. In your terminal:

1. `mkdir notes-server`
2. `cd notes-server`
3. `npm init -y`
4. `npm install fastify mongoose --save`
5. `mkdir src`
6. `touch src/index.ts`

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
app.listen(5000, (err, address) => {
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
    "start": "node src/index.js",
 },
```
If you now run npm start from your terminal you should see a message saying “Server running on http://127.0.0.1:5000”. Open your browser at http://localhost:5000 and you should see our “Hello world!” string, meaning our app is running successfully!

## Defining the Note Schema
At this point, we want to have a notes collection inside our database, and we also need to define the properties that a note document should have. We do so by creating a Note Model and providing a Model Schema, that is, an object with all the specification for a typical note document. Let’s create a new folder and file inside our project; in your project folder terminal:

```
mkdir src/models
touch src/models/Note.js
```

Let’s edit this new file as follows:

```
import mongoose, { Schema, Document, Model } from 'mongoose';

interface INote extends Document {
  text: string;
}

const noteSchema: Schema = new Schema({
  text: { type: String, required: true },
});

const Note: Model<INote> = mongoose.model('Note', noteSchema);

export default Note;

```

Basically we are using Mongoose’s Schema object to explicitely declare to our MongoDB that our notes will have a mandatory propery called text, which is, naturally, a string. We are then defining it as a model with the mongoose.model function. The first parameter is a string that will be used by mongo to define the name of the collection: given a “note” model, we will find a “notes” collection in our database after our very first operation with a Note. Finally, we export the newly created Note model and make it available throughout the application.
