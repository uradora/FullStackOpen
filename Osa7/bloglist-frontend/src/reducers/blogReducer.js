import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  if (action.type === 'INIT_BLOGS') {
    return action.data
  } else if (action.type === 'NEW_BLOG') {
    return state.concat(action.data)
  }
  return state
}

export const createBlog = ({ blog }) => {
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