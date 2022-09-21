'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('auths', [
      { username: 'guest', password: 'secret', role: 'guest', createdAt, updatedAt },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
