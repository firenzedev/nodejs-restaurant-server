const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const DatabaseSource = require('./datasource/DatabaseSource');
const dataLoaderBuilder = require('./dataloader');
const GraphQLServer = require('./server');

const db = new DatabaseSource({ models });

const graphQLServer = GraphQLServer({
  typeDefs,
  resolvers,
  sources: {
    db,
  },
  loaders: dataLoaderBuilder(db),
});

graphQLServer.start();
