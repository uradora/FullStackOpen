const Recommendation = (props) => {

  if (!props.show) {
    return null
  } 

  const genreBooks = props.books.filter(b => b.genres.includes(props.userGenre)) 

  return (
    <div>
      <h2>books in your favorite genre <b>{props.userGenre}</b></h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
            {genreBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendation
