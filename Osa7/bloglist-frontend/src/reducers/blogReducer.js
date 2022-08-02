import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  if (action.type === 'INIT_BLOGS') {
    return action.data
  } else if (action.type === 'NEW_BLOG') {
    return state.concat(action.data)
  } else if (action.type === 'SET_BLOGS') {
    return action.data
  } else if (action.type === 'DELETE_BLOG') {
    const id = action.data
    const updatedBlogs = state.filter(blog =>
      blog.id !== id
    )
    return updatedBlogs
  }
  return state
}

export const createBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    data: {
      id: blog.id,
      user: blog.user,
      likes: blog.likes,
      title: blog.title,
      author: blog.author,
      url: blog.url
    }
  }
}

export const like = (blog, blogs) => {
  return async dispatch => {
    const id = blog.id
    const blogToLike = blogs.find(b => b.id === id)
    const blogToUpdate = { ...blogToLike, likes: blogToLike.likes + 1 }
    const likedBlog = await blogService.update(blogToUpdate)
    const updatedBlogs = blogs.map(blog =>
      blog.id !== id ? blog : likedBlog
    )
    dispatch({
      type: 'SET_BLOGS',
      data: updatedBlogs
    })
  }
}

export const remove = (blog, blogs) => {
  return async dispatch => {
    const id = blog.id
    const blogToRemove = blogs.find(b => b.id === id)
    const removedBlog = await blogService.remove(blogToRemove.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: removedBlog.id
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer