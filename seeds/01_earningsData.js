/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('earnings').del();
    await knex('earnings').insert([
      {
        id: '1',
        name: 'John Doe',
        date: '2023-08-28', 
        amount: '95',
        paid: 'yes',
      },
      {
        id: '2',
        name: 'Jennifer Smith',
        date: '2023-08-28', 
        amount: '95',
        paid: 'yes',
      },
      {
        id: '3',
        name: 'Alex Clark',
        date: '2023-08-28', 
        amount: '95',
        paid: 'yes',
      },
    ]);
  };