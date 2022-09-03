const { ApolloServer } = require('apollo-server-fastify');
const fastifyWs = require('@fastify/websocket');
const { makeHandler } = require('graphql-ws/lib/use/@fastify/websocket');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fastify = require('fastify');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const DatabaseSource = require('./datasources/DatabaseSource');
const { PubSub } = require('graphql-subscriptions');

const port = process.env.PORT || 4000;
const host = '0.0.0.0';

const pubSub = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers });

function fastifyAppClosePlugin(app) {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

async function startApolloServer(schema) {
  const app = fastify();

  const db = new DatabaseSource({ models });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    dataSources: () => ({
      db,
    }),
    context: () => ({
      pubSub,
    }),
  });

  await server.start();

  app.register(server.createHandler());

  app.register(fastifyWs);
  app.register(async (app) => {
    app.get('/', async (request, reply) => reply.redirect(server.graphqlPath));
    app.get(
      '/subscriptions',
      { websocket: true },
      makeHandler({
        schema,
        context: () => ({
          pubSub,
          dataSources: {
            db,
          },
        }),
      })
    );
  });

  await app.listen(port, host);
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(schema);
