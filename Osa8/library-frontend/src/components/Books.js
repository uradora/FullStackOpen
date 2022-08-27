import { useState } from "react"
import { SET_GENRE } from "../App"

const Books = (props) => {

  const [genreToShow, setGenreToShow] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    onError: (error) => {
      setError([error][0].message)
    }
  })
  const [ setGenre, response ]  = useLazyQuery(SET_GENRE, {
    onError: (error) => {
      setError([error][0].message)
    }
  })

  useEffect(() => {
    if (response.data) {
      setGenre(response.data.allBooks)
    }
  }, [response])


  if (!props.show) {
    return null
  }

  const handleClick = (genre) => {
    setGenreToShow(genre)
  }  

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => {
            if (genreToShow === '' || a.genres.includes(genreToShow)) {
              return (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}})}
        </tbody>
      </table>
    <div>
    {allGenres.map((g) => (
      <button onClick={() => handleClick(g)}>{g}</button>
    ))}
    </div>
    </div>
  )
}

export default Books
