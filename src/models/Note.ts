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
