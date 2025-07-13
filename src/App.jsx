import { useState } from 'react'
import './App.css'
import {Link} from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div>
      <Link to='/restaurant/categories'>click here to go to category page</Link>
      <br></br>
      <Link to='/restaurant/products'>click here to go to products page</Link>
      <br/><br/>
      
      <Link to="/dashboard">Owner Dashboard</Link>
      <br/>
      <Link to="/rooms/home">Go to Room Management Home</Link>
      <br />  
      <Link to="/settings">Settings</Link>
      <br/>
      <Link to="/Transactionreports">TransactionReports</Link>
      <br/>
      <Link to="/Stockreports">StockReports</Link>
      <br/>
      <Link to="/Checkout">Checkout Details</Link>
      <br/><br/>

      <Link to="/info1">Click here to go to Info1 page</Link>



    </div>
  )
}

export default App
