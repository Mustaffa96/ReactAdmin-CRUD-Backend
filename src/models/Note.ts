import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  text: string;
  // Add any other fields you want for your notes
}

const NoteSchema = new Schema<INote>({
  text: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export const Note = mongoose.model<INote>('Note', NoteSchema);
