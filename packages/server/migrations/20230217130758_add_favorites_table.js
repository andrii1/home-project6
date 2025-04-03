/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments();
    table.integer('quote_id').unsigned();
    table.foreign('quote_id').references('id').inTable('quotes');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('favorites');
};
