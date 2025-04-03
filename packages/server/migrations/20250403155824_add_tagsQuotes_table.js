/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tagsQuotes', (table) => {
    table.increments();
    table.integer('quote_id').unsigned();
    table.foreign('quote_id').references('id').inTable('quotes');
    table.integer('tag_id').unsigned();
    table.foreign('tag_id').references('id').inTable('tags');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tagsQuotes');
};
