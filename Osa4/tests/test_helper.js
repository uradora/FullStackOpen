const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'aka',
    name: 'meri',
    password: 'paws',
  },
]

const insertUsers = async () => {
  const hashWord = await bcrypt.hash(initialUsers[0].password, 10)

  const user = new User({
    username: initialUsers[0].username,
    name: initialUsers[0].name,
    passwordHash: hashWord
  })

  await user.save()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialUsers, insertUsers, usersInDb,
}
