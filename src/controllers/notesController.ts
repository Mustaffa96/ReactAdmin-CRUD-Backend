import { FastifyRequest, FastifyReply } from 'fastify';
import Note from '../models/Note';

const controller = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const note = request.body as any;
      const newNote = await Note.create(note);
      reply.code(201).send(newNote);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

  fetch: async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const notes = await Note.find({});
      reply.code(200).send(notes);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

  get: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const noteId = (request.params as any).id;
      const note = await Note.findById(noteId);
      reply.code(200).send(note);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

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
};

export default controller;
