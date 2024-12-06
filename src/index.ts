import Fastify, { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';

const app: FastifyInstance = Fastify({
  logger: true
});

// Wrap configuration and startup in async function
const configure = async () => {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  await app.register(swagger, {
    swagger: {
      info: {
        title: 'Notes API',
        description: 'API documentation for Notes application',
        version: '1.0.0'
      },
      host: 'localhost:5000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
};

// Update start function to include configuration
const start = async () => {
  try {
    await configure();
    await mongoose.connect('mongodb://localhost:27017/notes_db');
    console.log('MongoDB connected successfully');

    // Add content-range hook
    // app.addHook('preHandler', (request, reply, done) => {
    //   contentRangeHook(request, reply)
    //     .then(() => done())
    //     .catch(done);
    // });

    // Register routes
    await app.register(noteRoutes);

    // Start server
    await app.listen({ port: 5000 });
    console.log('Server running on http://localhost:5000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
