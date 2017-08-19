
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', table => {
      table.increments('id').primary()
      table.string('name')

      table.timestamps(true, true)
    }),

    knex.schema.createTable('urls', table => {
      table.increments('id').primary()
      table.string('longURL')
      table.string('shortURL')
      table.integer('folder_id').unsigned()
      table.foreign('folder_id').references('folders.id')

      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('urls'),
    knex.schema.dropTable('folders')
  ])
}
