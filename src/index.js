const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const servicesGenerator = require('./service');
const loadersGenerator = require('./dataloader');
const GraphQLServer = require('./server');

const graphQLServer = GraphQLServer({
  typeDefs,
  resolvers,
  servicesGenerator: servicesGenerator(models),
  loadersGenerator,
});

graphQLServer.start();
