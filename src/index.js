const { ApolloServer } = require('apollo-server-fastify');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const fastify = require('fastify');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const DatabaseSource = require('./datasource/DatabaseSource');

const db = new DatabaseSource(models);

const startGraphQLServer = async (typeDefs, resolvers) => {
  const port = process.env.PORT || 4000;
  const host = '0.0.0.0';

  const webServer = fastify();

  const fastifyAppClosePlugin = (app) => ({
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      db,
    }),
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      fastifyAppClosePlugin(webServer),
      ApolloServerPluginDrainHttpServer({ httpServer: webServer.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await apolloServer.start();

  webServer.register(apolloServer.createHandler());

  await webServer.listen(port, host);
  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
};

startGraphQLServer(typeDefs, resolvers);
