'use strict';

const faker = require("faker");

let users = [];


users.push(
  {
    id: 1,
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.random.number(2),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.random.number(2),
    createdAt: new Date(),
    updatedAt: new Date()
  }

);


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {})
  }
};
