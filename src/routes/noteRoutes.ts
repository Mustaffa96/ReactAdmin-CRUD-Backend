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
