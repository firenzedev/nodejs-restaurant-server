'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('replies', 'reviewId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'reviews',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('replies', 'reviewId');
  },
};
