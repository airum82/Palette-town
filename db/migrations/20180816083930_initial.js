
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', 
    (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('project_id');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes',
    (table) => {
      table.increments('id').primary();
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
      table.string('project_id').unsigned();
      table.foreign('project_id')
        .references('project_id')

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ])
};
