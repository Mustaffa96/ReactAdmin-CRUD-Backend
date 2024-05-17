import { FastifyReply, FastifyRequest } from 'fastify';
import Note from '../models/Note';

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
