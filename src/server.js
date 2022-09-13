const { ApolloServer } = require('apollo-server-fastify');
const fastifyWs = require('@fastify/websocket');
const { makeHandler } = require('graphql-ws/lib/use/@fastify/websocket');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fastify = require('fastify');
const { PubSub } = require('graphql-subscriptions');
const depthLimit = require('graphql-depth-limit');

const GraphQLServer = (options) => {
  const { typeDefs, resolvers, sources, loaders } = options;
  const port = process.env.PORT || 4000;
  const host = '0.0.0.0';

  const webServer = fastify();
  const pubSub = new PubSub();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const context = () => ({
    pubSub,
    loaders,
  });

  const dataSources = () => sources;

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
    schema,
    dataSources,
    context,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      fastifyAppClosePlugin(webServer),
      ApolloServerPluginDrainHttpServer({ httpServer: webServer.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    validationRules: [depthLimit(10)],
  });

  const subscriptionHandler = makeHandler({
    schema,
    context,
  });

  return {
    start: async () => {
      await apolloServer.start();

      webServer.register(apolloServer.createHandler());
      webServer.register(fastifyWs);
      webServer.register(async (webServer) => {
        webServer.get('/', async (_request, reply) => reply.redirect(apolloServer.graphqlPath));
        webServer.get('/subscriptions', { websocket: true }, subscriptionHandler);
      });

      await webServer.listen(port, host);
      console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
    },

    instance: apolloServer,
  };
};

module.exports = GraphQLServer;
