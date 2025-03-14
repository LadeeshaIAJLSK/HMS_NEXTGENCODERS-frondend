import { useState } from 'react'

import './App.css'
import {Link} from 'react-router'

function App() {

  return (
    <div>
      <Link to='/restaurant/categories'>click here to go to category page</Link>
      <br></br>
      <br></br>
      <Link to='/restaurant/products'>click here to go to products page</Link>
      <br></br>
      <Link to="/info1">Click here to go to Info1 page</Link>


    </div>
  )
}

export default App
