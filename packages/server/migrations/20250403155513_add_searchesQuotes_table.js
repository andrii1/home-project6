/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('searchesQuotes', (table) => {
    table.increments();
    table.integer('quote_id').unsigned();
    table.foreign('quote_id').references('id').inTable('quotes');
    table.integer('search_id').unsigned();
    table.foreign('search_id').references('id').inTable('searches');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('searchesQuotes');
};
