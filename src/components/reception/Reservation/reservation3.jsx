import React, { useState } from 'react';
import './reservation3.css';

const Reservation3 = () => {
  const [persons, setPersons] = useState([
    { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }
  ]);

  const handleAddPerson = () => {
    setPersons([...persons, { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
  };

  const handleRemovePerson = (index) => {
    if (persons.length > 1) {
      const updatedPersons = [...persons];
      updatedPersons.splice(index, 1);
      setPersons(updatedPersons);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  const getTextColor = (value) => (value ? '#000000' : '#718096');

  return (
    <div className="reservation3-container">
      <h2>Information of Other Person</h2>
      <div className="table-responsive">
        <table className="person-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Address</th>
              <th>Type of ID</th>
              <th>ID No.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Enter Name"
                    style={{ color: getTextColor(person.name) }}
                    className="table-input"
                  />
                </td>
                <td>
                  <select
                    value={person.gender}
                    onChange={(e) => handleChange(index, 'gender', e.target.value)}
                    style={{ color: getTextColor(person.gender) }}
                    className="table-select"
                  >
                    <option value="">--Select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={person.age}
                    onChange={(e) => handleChange(index, 'age', e.target.value)}
                    placeholder="Enter Age"
                    style={{ color: getTextColor(person.age) }}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={person.address}
                    onChange={(e) => handleChange(index, 'address', e.target.value)}
                    placeholder="Enter Address"
                    style={{ color: getTextColor(person.address) }}
                    className="table-input"
                  />
                </td>
                <td>
                  <select
                    value={person.idType}
                    onChange={(e) => handleChange(index, 'idType', e.target.value)}
                    style={{ color: getTextColor(person.idType) }}
                    className="table-select"
                  >
                    <option value="">--Select--</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="National ID">National ID</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={person.idNo}
                    onChange={(e) => handleChange(index, 'idNo', e.target.value)}
                    placeholder="Enter ID No."
                    style={{ color: getTextColor(person.idNo) }}
                    className="table-input"
                  />
                </td>
                <td>
                  {index === 0 ? (
                    <button className="add-btn" onClick={handleAddPerson}>
                      +
                    </button>
                  ) : (
                    <button className="remove-btn" onClick={() => handleRemovePerson(index)}>
                      -
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservation3;
