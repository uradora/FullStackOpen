import React from 'react'
import { Link } from 'react-router-dom'

const Users = ( { users } ) => {
  return (
    <div>
      <ul>
        {users.map(user =>
          <li key='user.id'>
            <Link to={`/users/${user.id}`}>{user.username}</Link> created blogs: {user.blogs.reduce((blogs) => blogs + 1, 0)}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Users