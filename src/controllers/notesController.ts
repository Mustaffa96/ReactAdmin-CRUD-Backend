import { FastifyRequest, FastifyReply } from 'fastify';
import { Note, INote } from '../models/Note';

interface IParams {
  id: string;
}

interface IBody {
  text: string;
}

export async function createNote(
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply
) {
  try {
    const note = await Note.create(request.body);
    return reply.code(201).send(note);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function getNotes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const notes = await Note.find({});
    return reply.send(notes);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function getNote(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply
) {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      return reply.code(404).send({ message: 'Note not found' });
    }
    return reply.send(note);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function updateNote(
  request: FastifyRequest<{ Params: IParams; Body: IBody }>,
  reply: FastifyReply
) {
  try {
    const note = await Note.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    if (!note) {
      return reply.code(404).send({ message: 'Note not found' });
    }
    return reply.send({ data: note });
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function deleteNote(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply
) {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      return reply.code(404).send({ message: 'Note not found' });
    }
    await Note.findByIdAndDelete(request.params.id);
    return reply.send(note);
  } catch (error) {
    return reply.code(500).send(error);
  }
}
