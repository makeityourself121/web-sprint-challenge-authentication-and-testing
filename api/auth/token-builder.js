const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets')

module.exports = function (user) {
  const payload = {
    id: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}
