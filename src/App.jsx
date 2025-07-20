


  

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

      <Link to="/rooms/home">Go to Room Management Home</Link>
      <br />  
      <Link to="/rooms/add">Add a New Room</Link>
      <br />
      <Link to="/rooms/edit/:id">Edit Room Details</Link>

      
      <br /><br />

      <br />
      <Link to="/settings">Settings</Link>
      <br/>
      <Link to="/reports">Reports</Link>
      <br/><br/>

      <Link to="/page1">Go to Reception Reservation</Link>
      <br/><br/>
      <Link to="/rooms">Go to Reception Rooms</Link>
      <br/><br/>
      <Link to="/guest">Go to Reservation Management</Link>
      <br/><br/>
      <Link to="/dashboard">Go to Reception Dashboard</Link>
      <Link to="/edit-reservation">Go to Edit Reservation</Link>
      <br/><br/>
      <Link to="packages">Go to Package Management Home</Link>
      <br />
      <Link to="hdash">Go to new Hotel Dashboard</Link>
      <br />
      <Link to="/dayout">Go to Day Out Reservation</Link>
      
      

      



    </div>
  )

}

export default App;






