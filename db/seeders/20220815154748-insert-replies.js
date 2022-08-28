'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {
    const restaurants = await queryInterface.sequelize.query('select * from restaurants', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const DaLuigi = restaurants.find((r) => r.name === 'Da Luigi').id;

    const reviews = await queryInterface.sequelize.query('select * from reviews', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const DaLuigiRating4 = reviews.find((r) => r.restaurantId === DaLuigi && r.rating === 4).id;

    return queryInterface.bulkInsert('replies', [
      {
        reviewId: DaLuigiRating4,
        message: 'Chi ti credi di essere?',
        createdAt,
        updatedAt,
      },
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
