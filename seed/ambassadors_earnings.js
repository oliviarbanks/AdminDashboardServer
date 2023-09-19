const earningsData = require ("../seeds/01_earningsData");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  knex('earnings').del()
  knex('earnings').insert(earningsData);
};
