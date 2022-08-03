import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  if (action.type === 'INIT_BLOGS') {
    return action.data
  } else if (action.type === 'NEW_BLOG') {
    return state.concat(action.data)
  } else if (action.type === 'ADD_LIKE') {
    const id = action.data.id
    const blogToLike = state.find(blog => blog.id === id)
    const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
    return state.map(blog => blog.id !== id ? blog : likedBlog)
  } else if (action.type === 'DELETE_BLOG') {
    const idToDelete = action.data
    console.log(idToDelete)
    return state.filter(blog =>
      blog.id !== idToDelete
    )
  }
  return state
}

export const remove = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const blogToAdd = await blogService.create(blog)
    dispatch( {
      type: 'NEW_BLOG',
      data: {
        blogToAdd
      }
    })
  }
}


export const like = (blog) => {
  return async dispatch => {
    const likedBlog = await blogService.update(blog)
    dispatch ({
      type: 'ADD_LIKE',
      data: likedBlog
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