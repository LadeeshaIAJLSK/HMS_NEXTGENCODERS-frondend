import { useState } from 'react'
import './App.css'
import {Link} from 'react-router-dom'

function App() {

  return (
    <div>
      <Link to='/restaurant/categories'>click here to go to category page</Link>
      <br></br>
      <Link to='/restaurant/products'>click here to go to products page</Link>
      <br></br>
      <Link to="/rooms/home">Go to Room Management Home</Link>
      <br /><br />
      <Link to="/rooms/add">Add a New Room</Link>
    </div>
  )
}

export default App
