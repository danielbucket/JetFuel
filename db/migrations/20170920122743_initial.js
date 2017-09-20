
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('folders', table => {
      table.increments('id').primary()
      table.string('name').unique()

      table.timestamps(true, true)
    }),

    knex.schema.createTable('urls', table => {
      table.increments('id').primary()
      table.string('longURL')
      table.string('shortURL')
      table.string('url_name')
      table.integer('folder_id').unsigned()
      table.foreign('folder_id').references('folders.id')

      table.timestamps(true, true)
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('urls'),
    knex.schema.dropTable('folders')
  ])
}