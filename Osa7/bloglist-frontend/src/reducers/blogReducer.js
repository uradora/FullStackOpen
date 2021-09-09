import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  if (action.type === 'NEW_BLOG') {
    return state.concat(action.data)
  } else if (action.type === 'INIT_BLOGS') {
    return action.data
  } else if (action.type === 'LIKE') {
    return state.map(blog =>
      blog.id !== action.data.id ? blog : action.data)
  } else if (action.type === 'DELETE') {
    return state.filter(blog =>
      blog.id !== action.data.id)
  }
  return state
}

export const likeBlog = ({ updatedBlog }) => {
  return {
    type: 'LIKE',
    data: {
      id: updatedBlog.id,
      user: updatedBlog.user,
      likes: updatedBlog.likes,
      author: updatedBlog.author,
      title: updatedBlog.title,
      url: updatedBlog.url,
    }
  }
}

export const deleteBlog = ({ blogToRemove }) => {
  return {
    type: 'DELETE',
    data: {
      id: blogToRemove.id,
      user: blogToRemove.user,
      likes: blogToRemove.likes,
      author: blogToRemove.author,
      title: blogToRemove.title,
      url: blogToRemove.url,
    }
  }
}

export const createBlog = ({ returnedBlog }) => {
  return {
    type: 'NEW_BLOG',
    data: {
      id: returnedBlog.id,
      user: returnedBlog.user,
      likes: returnedBlog.likes,
      author: returnedBlog.author,
      title: returnedBlog.title,
      url: returnedBlog.url,
    }
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

