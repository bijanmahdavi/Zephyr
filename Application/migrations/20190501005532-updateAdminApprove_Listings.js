'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Listings','adminApprove',{
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: 'price'
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */return queryInterface.removeColumn('Listings','adminApprove');
  }
};
