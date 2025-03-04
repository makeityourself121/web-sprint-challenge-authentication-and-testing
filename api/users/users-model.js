const db = require('../../data/dbConfig')

module.exports = {
  add,
  findById,
  findBy,
}

async function add(user) {
  const [id] = await db('users').insert(user)
  return findById(id)
}

function findById(id) {
  return db('users').where('id', id).first()
}

function findBy(filter) {
  return db('users').where(filter)
}
