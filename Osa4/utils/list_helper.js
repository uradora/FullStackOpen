const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = blogs.map((blog) => blog.likes)
  return likes.reduce((like, next) => like + next, 0)
}

const favoriteBlog = (blogs) => {
  let likes = blogs.map((blog) => blog.likes)
  let mostLikes = Math.max(...likes)
  return blogs.find((blog) => blog.likes === mostLikes)
}

const mostBlogs = (blogs) => {
  let authorsCount = _.reduce(blogs, (total, blog) => {
    total[blog.author] = (total[blog.author] || 0) + 1
    return total
  }, [])
  return _.keys(authorsCount).reduce((most, curr) => 
    authorsCount[curr] > authorsCount[most] ? curr : most)
}

const mostLikes = (blogs) => {
  let likesCount = _.reduce(blogs, (total, blog) => {
    total[blog.author] = (total[blog.author] || 0) + blog.likes
    return total
  }, [])
  author = _.keys(likesCount).reduce((most, curr) => 
    likesCount[curr] > likesCount[most] ? curr : most)
  return { author: author, likes: likesCount[author]}
}

module.exports = { 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}