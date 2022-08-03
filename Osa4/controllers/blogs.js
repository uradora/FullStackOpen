const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('./../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map((blog) => blog.toJSON()));
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: body.comments || []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response
      .status(401)
      .json({ error: 'no access rights to remove this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blogToUpdate = await Blog.findById(request.params.id)

  console.log(body.comments)
  
  const blog = {
    title: body.title || blogToUpdate.title,
    author: body.author || blogToUpdate.author,
    url: body.url || blogToUpdate.url,
    likes: body.likes || blogToUpdate.likes,
    comments: body.comments || blogToUpdate.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter