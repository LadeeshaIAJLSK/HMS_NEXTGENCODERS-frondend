import { useState } from 'react'

import './App.css'
import {Link} from 'react-router'

function App() {

  return (
    <div>
    
      <Link to="/info1">Click here to go to Info1 page</Link>
      <Link to="/info2">Click here to go to Info2 page</Link>
    </div>
  )
}

export default App
