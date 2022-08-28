'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('reviews', 'restaurantId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'restaurants',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('reviews', 'restaurantId');
  },
};
