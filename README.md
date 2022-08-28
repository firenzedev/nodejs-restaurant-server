# Restaurant Server

This is a demo project to show an implementation of a GraphQL server using Node.js with
Apollo GraphQL and Fastify.

## Usage

To install all the dependencies, run:

``npm install`

The project uses a SQLite database, that must be created before launching the application:

`npx sequelize-cli db:migrate`

To fill the database with some demo data, use this command:

`npx sequelize-cli db:seed:all`
