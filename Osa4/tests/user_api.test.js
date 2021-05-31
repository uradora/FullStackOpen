const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const { initialUsers } = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  await helper.insertUsers()
})
test('creation fails with proper statuscode and message if username already taken', async () => {
  const newUser = {
    username: 'aka',
    name: 'meri',
    password: 'paws',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('Username must be unique')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

test('creation fails if username is missing and error message reflects that', async () => {
  const newUser = {
    name: 'salainen',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('missing')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

test('creation fails if password is missing and error message reflects that', async () => {
  const newUser = {
    username: 'ameeba',
    name: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('missing')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

test('creation fails if username is too short and error message reflects that', async () => {
  const newUser = {
    username: 'am',
    name: 'salainen',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('at least 3 characters')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

test('creation fails if password is too short and error message reflects that', async () => {
  const newUser = {
    username: 'ameeba',
    name: 'salainen',
    password: 'sa',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('at least 3 characters')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

afterAll(() => {
  mongoose.connection.close()
})
