'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let schema = 'public';
    if (process.env.NODE_ENV === 'development') {
      schema = 'test';
    }
    await queryInterface.createTable(
      { tableName: 'Links', schema: schema },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM('registration', 'login', 'password_reset'),
          allowNull: false,
          defaultValue: 'registration',
        },
        expiresAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("NOW() + INTERVAL '1 day'"),
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

  async down(queryInterface, Sequelize) {
    let schema = 'public';
    if (process.env.NODE_ENV === 'development') {
      schema = 'test';
    }
    await queryInterface.dropTable({
      tableName: 'Links',
      schema: schema,
    });
  },
};
