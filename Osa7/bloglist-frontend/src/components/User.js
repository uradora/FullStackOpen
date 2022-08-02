import React from 'react'
import { useParams } from 'react-router-dom'

const User = ({ users }) => {

  const id = useParams().id
  const user = users.find(user => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2> {user.name} </h2>
      <h3>added blogs</h3>
      {user.blogs.map(blog => <p key={blog.id}>
        {blog.title}
      </p>)

      }
    </div>
  )

}

export default User