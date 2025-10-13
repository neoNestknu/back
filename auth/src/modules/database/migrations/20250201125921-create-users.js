'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let schema = 'public';
    if (process.env.NODE_ENV === 'development') {
      schema = 'test';
    }
    await queryInterface.createTable(
      {
        tableName: 'Users',
        schema: schema,
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        isActivated: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    let schema = 'public';
    if (process.env.NODE_ENV === 'development') {
      schema = 'test';
    }
    await queryInterface.dropTable({ tableName: 'Users', schema: schema });
  },
};
