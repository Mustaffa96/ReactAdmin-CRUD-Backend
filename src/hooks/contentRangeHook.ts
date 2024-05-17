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
