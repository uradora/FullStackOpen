import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendation from './components/Recommendation'
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
      }
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
      author
      published
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

const ME = gql`
query {
  me {
    favoriteGenre
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const userGenre = useQuery(ME)
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
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (authors.loading || books.loading || userGenre.loading) {
    return <div>loading</div>
  }

  const logout = () => {    
    setToken(null)    
    localStorage.clear()   
    client.cache.reset()
    setPage('authors')  
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
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  console.log(userGenre)

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => logout('logout')}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} setBirthYear={setBirthYear} />

      <Books show={page === 'books'} books={books.data.allBooks} />

      <NewBook show={page === 'add'} addBook={addBook} />

      <Recommendation show={page === 'recommend'} userGenre={userGenre} books={books.data.allBooks} />
    </div>
  )

}

export default App
