'use strict'

exports.up = (knex) => {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('user_name').notNullable()
    table.string('user_pic').notNullable()
    table.string('user_email').notNullable().unique()
    table.specificType('hashed_password', 'char(60)').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('users')
}
