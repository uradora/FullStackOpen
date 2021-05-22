import React from "react"

const Filter = ({ filtre, setShowAll, setFiltre }) => {

  const handleFilterChange = (event) => {
    setShowAll(false);
    setFiltre(event.target.value)
  }

  return (
    <div>
      filter shown with <input value={filtre} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter