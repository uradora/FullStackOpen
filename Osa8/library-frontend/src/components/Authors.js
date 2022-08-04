import { useState } from 'react'

const Authors = (props) => {

  
  const [ name, setName] = useState('')
  const [ born, setBorn ] = useState('') 

  if (!props.show) {
    return null
  }

  const submitBirthyear = async (event) => {
    event.preventDefault()
    
    props.setBirthYear( { variables: { name, setBornTo: parseInt(born, 10) }} )

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>
            </th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <h2>Set birthyear</h2>
      <form onSubmit={submitBirthyear}>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {props.authors.map((a) => (
             <option value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
