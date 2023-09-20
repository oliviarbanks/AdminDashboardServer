const usersData = require ("../seeds/02_users");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  knex('users').del()
  knex('users').insert(usersData);
};
