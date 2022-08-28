const { ApolloServer } = require('apollo-server-fastify');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const fastify = require('fastify');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const DatabaseSource = require('./datasources/DatabaseSource');

const port = process.env.PORT || 4000;
const host = '0.0.0.0';

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

async function startApolloServer(typeDefs, resolvers) {
  const app = fastify();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    dataSources: () => ({
      db: new DatabaseSource({ models }),
    }),
  });

  await server.start();

  app.get('/', async (request, reply) => reply.redirect(server.graphqlPath));
  app.register(server.createHandler());
  await app.listen(port, host);
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
