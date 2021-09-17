const Users = require('../users/users-model')

function validateUser(req, res, next) {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(422).json({ message: 'username and password are required' })
  } else {
    next()
  }
}

function usernameIsUnique(req, res, next) {
  const { username } = req.body
  Users.findBy({ username })
    .then(([user]) => {
      if (user) {
        res.status(422).json({ message: 'username taken' })
      } else {
        next()
      }
    })
    .catch((err) => {
      res.status(500).json(err.message)
    })
}

module.exports = {
  validateUser,
  usernameIsUnique,
}
