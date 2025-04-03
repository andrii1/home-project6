/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('keywords', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.integer('quote_id').unsigned();
    table.foreign('quote_id').references('id').inTable('quotes');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('keywords');
};
