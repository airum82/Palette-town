
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').del()
    .then(() => knex('palettes').del())
    .then(function () {
      return Promise.all([
        knex('projects').insert({ project_id: 1,
          name: 'superfly'}),
        knex('projects').insert({ project_id: 2,
          name: 'youKnowIt'}),
        knex('palettes').insert(
          { project_id: 1,
            color1: 'green',
            color2: 'pink',
            color3: 'orange',
            color4: 'blue',
            color5: 'red' }
        )
      ])
    });
};
