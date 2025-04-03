/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('quotes', (table) => {
    table.increments();
    table.text('title').notNullable();
    table.text('description').nullable();
    table.text('url').nullable();
    table.text('url').nullable();
    table.text('meta_description').nullable();
    table.integer('author_id').unsigned();
    table.foreign('author_id').references('id').inTable('authors');
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
  return knex.schema.dropTable('quotes');
};
