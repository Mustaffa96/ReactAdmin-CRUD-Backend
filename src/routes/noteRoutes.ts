import { FastifyInstance } from 'fastify';
import { 
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote 
} from '../controllers/notesController';

const Note = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    text: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
};

const createNoteOpts = {
  schema: {
    body: {
      type: 'object',
      required: ['text'],
      properties: {
        text: { type: 'string' }
      }
    },
    response: {
      201: Note
    }
  }
};

export default async function noteRoutes(app: FastifyInstance) {
  // Create a new note
  app.post('/api/notes', createNoteOpts, createNote);

  // Get all notes
  app.get('/api/notes', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: Note
        }
      }
    }
  }, getNotes);

  // Get single note by id
  app.get('/api/notes/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: Note
      }
    }
  }, getNote);

  // Update note by id
  app.put('/api/notes/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string' }
        }
      },
      response: {
        200: Note
      }
    }
  }, updateNote);

  // Delete note by id
  app.delete('/api/notes/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: Note
      }
    }
  }, deleteNote);
}
