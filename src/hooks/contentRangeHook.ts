import { FastifyRequest, FastifyReply } from 'fastify';
import { Note } from '../models/Note';

export async function contentRangeHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  try {
    const totalCount = await Note.countDocuments({});
    reply.header('Content-Range', `notes 0-10/${totalCount}`);
    done();
  } catch (error) {
    console.error('Content Range Hook Error:', error);
    done();
  }
}
