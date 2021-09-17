const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/index')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' })
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    res.status(407).json({ message: 'token required' })
  }
}
