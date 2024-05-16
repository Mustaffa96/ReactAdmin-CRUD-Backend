# ReactAdmin-FullStack-CRUD

#Project Setup
Before we begin, make sure to have globally installed Node.js on your machine, this is crucial to import all our dependencies and set up both the backend and the frontend projects. Also, I will use a local instance of MongoDB for the database, but you can also use a free cluster hosted on MongoDB Atlas.

So, in order to setup the backend side, let’s create a new folder for the project, install our dependencies and set up the structure. In your terminal:

1. mkdir notes-server
2. cd notes-server
3. npm init -y
4. npm install fastify mongoose --save
5. mkdir src
6. touch src/index.ts

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
