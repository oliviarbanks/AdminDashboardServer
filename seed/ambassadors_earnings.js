const earningsData = require ("../seeds/01_earningsData");

exports.seed = function(knex) {
  knex('earnings').del()
  knex('earnings').insert(earningsData);
};
