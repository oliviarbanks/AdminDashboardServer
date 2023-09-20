const usersData = require ("../seeds/02_users");

exports.seed = function(knex) {
  knex('users').del()
  knex('users').insert(usersData);
};
