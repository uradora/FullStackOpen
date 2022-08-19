import { useState } from "react"

const Books = (props) => {

  let allGenres = []
  allGenres = props.books.flatMap(a => [...allGenres, ...a.genres])
  allGenres = [...new Set(allGenres)]

  const [genreToShow, setGenreToShow] = useState('')
  
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
