import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name,
      born,
      bookCount
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title,
      author {
        name
      },
      published,
      genres
    }
  }
`

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const SET_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const App = () => {
  const [token, setToken] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [ addBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      notify(error.graphQLErrors[0].message)
    }
  })
  const [ setBirthYear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
  })
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  if (authors.loading || books.loading) {
    return <div>loading</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
        {errorMessage}
      </div>
    )
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} setBirthYear={setBirthYear} />

      <Books show={page === 'books'} books={books.data.allBooks} />

      <NewBook show={page === 'add'} addBook={addBook} />
  
            
    </div>
  )

}

export default App
