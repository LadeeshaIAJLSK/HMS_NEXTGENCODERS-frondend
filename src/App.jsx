import { useState } from 'react'
import './App.css'
import {Link} from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div>
      <Link to='/restaurant/login'>click here to go to login page</Link>
      <br></br>
      <Link to='/restaurant/categories'>click here to go to category page</Link>
      <br></br>
      <Link to='/restaurant/products'>click here to go to products page</Link>
      <br></br>
      <Link to='/restaurant/analytics'>click here to go to analytics page</Link>
      <br></br>

    </div>
  )
}

export default App
