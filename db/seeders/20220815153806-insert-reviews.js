'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {
    const restaurants = await queryInterface.sequelize.query('select * from restaurants', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const DaLuigi = restaurants.find((r) => r.name === 'Da Luigi').id;
    const PizzaEFichi = restaurants.find((r) => r.name === 'Pizza e fichi').id;
    const AsianSushiBar = restaurants.find((r) => r.name === 'Asian sushi bar').id;

    return queryInterface.bulkInsert('reviews', [
      {
        restaurantId: DaLuigi,
        message: 'Il servizio è accurato con tocchi casuali di scortesia.',
        rating: 3,
        createdAt,
        updatedAt,
      },
      {
        restaurantId: DaLuigi,
        message:
          'Lo chef vorrebbe creare una cucina ingegnosa e domestica, che tradisce, invece, la sua preparazione decennale, con risultati decisamente disruptive.',
        rating: 4,
        createdAt,
        updatedAt,
      },
      {
        restaurantId: PizzaEFichi,
        message:
          'L’ambiente è del genere metropolitano–trasandato con inutili tovaglie e tovaglioli in resina disegnati dal noto studio architettonico che ha firmato tutti i locali del gruppo.',
        rating: 2,
        createdAt,
        updatedAt,
      },
      {
        restaurantId: PizzaEFichi,
        message: 'Tutto buonissimo',
        rating: 5,
        createdAt,
        updatedAt,
      },
      {
        restaurantId: AsianSushiBar,
        message: 'Il sushi sembra vivo',
        rating: 5,
        createdAt,
        updatedAt,
      },
      {
        restaurantId: AsianSushiBar,
        message: 'Il sushi sembra vivo, che schifo!',
        rating: 1,
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
