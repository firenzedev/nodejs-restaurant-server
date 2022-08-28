'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('restaurants', [
      { name: 'Da Luigi', address: 'Via Verdi 91B', city: 'Napoli', createdAt, updatedAt },
      { name: 'Pizza e fichi', address: 'Corso Italia 21', city: 'Roma', createdAt, updatedAt },
      { name: 'Asian sushi bar', address: 'Via Shangai 45', city: 'Napoli', createdAt, updatedAt },
      { name: 'Ciccio Marina', address: 'Viale Giovanni da Verazzano 1', city: 'Firenze', createdAt, updatedAt },
      { name: 'Enoteca Velia', address: 'Via A. Manzoni 1', city: 'Firenze', createdAt, updatedAt },
      { name: 'Il Buscaiol', address: 'Via Genova 6', city: 'Firenze', createdAt, updatedAt },
      { name: 'Il Rebacco', address: 'Via Loris Giorgi 5', city: 'Bologna', createdAt, updatedAt },
      { name: 'La Capinera Osteria tipica', address: 'Via Ulivi 8', city: 'Bologna', createdAt, updatedAt },
      { name: 'Il Ghiottone', address: 'Via Verdi 24', city: 'Napoli', createdAt, updatedAt },
      { name: 'Le Petite Cuisine', address: 'Via Verdi 4', city: 'Bologna', createdAt, updatedAt },
      { name: 'l Purtunzin Ninan', address: 'Via bartolini 3', city: 'Milano', createdAt, updatedAt },
      { name: 'Osteria Merope', address: 'Via degli Ulivi 4', city: 'Milano', createdAt, updatedAt },
      { name: 'Osteria Vittorio', address: 'Via Cavour 28', city: 'Milano', createdAt, updatedAt },
      { name: 'Ristorante Club Nautico', address: 'Viale Cristoforo 2', city: 'Milano', createdAt, updatedAt },
      { name: 'La Tavernetta', address: 'Piazza Alberica 10', city: 'Roma', createdAt, updatedAt },
      { name: 'Venanzio', address: 'Piazza Palestro 3', city: 'Roma', createdAt, updatedAt },
      { name: 'La Bottega dei Parchi', address: 'Piazza dei Parchi 13', city: 'Napoli', createdAt, updatedAt },
      { name: 'Albergo Ristorante Il Giardinetto', address: 'Via Roma 155', city: 'Roma', createdAt, updatedAt },
      { name: 'Da Remo', address: 'Via Cesare Battisti 57', city: 'Roma', createdAt, updatedAt },
      { name: 'Il Sicomoro', address: 'Via pianezza 2', city: 'Torino', createdAt, updatedAt },
      { name: 'La Posta', address: 'Via Provinciale 15', city: 'Torino', createdAt, updatedAt },
      { name: 'Nigo Pezigo', address: 'Via Papiriana 1A', city: 'Genova', createdAt, updatedAt },
      { name: 'Al Falco', address: 'Via Piana 27', city: 'Napoli', createdAt, updatedAt },
      { name: 'Ristorante Cocopizza', address: 'Via Caniparola 7', city: 'Genova', createdAt, updatedAt },
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
