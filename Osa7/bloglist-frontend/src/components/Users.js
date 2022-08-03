import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@mui/material'

const Users = ( { users } ) => {
  return (
    <Container>
      <ul>
        {users.map(user =>
          <li key='user.id'>
            <Link to={`/users/${user.id}`}>{user.username}</Link> created blogs: {user.blogs.reduce((blogs) => blogs + 1, 0)}
          </li>
        )}
      </ul>
    </Container>
  )
}

export default Users