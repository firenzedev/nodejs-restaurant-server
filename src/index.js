const typeDefs = require('./schema');
const resolvers = require('./resolver');
const models = require('../db/models');
const DatabaseSource = require('./datasource/DatabaseSource');
const dataLoaderBuilder = require('./dataloader');
const GraphQLServer = require('./server');

const sourcesGenerator = (user) => {
  return {
    db: new DatabaseSource({
      models,
      user,
    }),
  };
};

const graphQLServer = GraphQLServer({
  typeDefs,
  resolvers,
  sourcesGenerator,
  loadersGenerator: (db) => dataLoaderBuilder(db),
});

graphQLServer.start();
