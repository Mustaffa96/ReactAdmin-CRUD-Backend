// Import fastify & mongoose
import fastify from 'fastify';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes';

// Initialize Fastify App
const app = fastify();

// Connect fastify to mongoose
try {
  mongoose.connect('mongodb://localhost:27017/notes_db');
} catch (e) {
  console.error(e);
}

noteRoutes(app);

// Set application listening on port 5000 of localhost
app.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});
