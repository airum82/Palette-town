
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('palettes', (table) => {
      table.string('name')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('palettes', (table) => {
      table.dropColumn('name')
    })
  ])
};
