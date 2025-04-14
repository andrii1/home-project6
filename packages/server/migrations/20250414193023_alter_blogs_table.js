/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.alterTable('blogs', (table) => {
    table.dropColumn('published'); // Remove the 'published' column
    table
      .enum('status', ['published', 'draft'])
      .notNullable()
      .defaultTo('draft'); // Add enum column with default
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('blogs', (table) => {
    table.dropColumn('status'); // Remove the enum column
    table.boolean('published').notNullable().defaultTo(false); // Add the 'published' column back
  });
};
