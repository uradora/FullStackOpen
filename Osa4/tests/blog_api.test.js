const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('./../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "reactpatterns.com",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
] 

let token
let decodedToken

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)

  const loginUser = {
    username: 'aka',
    password: 'paws',
  };

  const response = await api.post('/api/login').send(loginUser).expect(200);

  token = JSON.parse(response.text).token
})

test('login functions', async () => {
  const loginUser = {
    username: 'aka',
    password: 'paws',
  }

  const response = await api.post('/api/login').send(loginUser).expect(200)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns the correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have id and not _id', async () => {
  const response = await api.get('/api/blogs')

  const results = response.body.map((r) => r.id)

  expect(results[0]).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Merin',
    author: 'Meri',
    url: 'https://unsummonedthoughts.wordpress.com/author/unsummonedthoughts/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)

  const response = await api.get('/api/blogs')

  const results = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(results).toContain('Merin')
})

test('an added blog with no likes given has 0 likes', async () => {
  const newBlog = {
    title: 'Merin',
    author: 'Meri',
    url: 'https://unsummonedthoughts.wordpress.com/author/unsummonedthoughts/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'Bearer ' + token)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const result = response.body.find((r) => r.title === 'Merin')

  expect(result.likes).toBe(0)
})

test('blog is not added if it doesn\'t contain title and url', async () => {
  const newBlog = {
    title: 'Merin',
    author: 'Meri',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'Bearer ' + token)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
