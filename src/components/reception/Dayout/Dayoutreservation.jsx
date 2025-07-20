import React from 'react';
import { countries } from "../FormSection1/countries"
import useDayoutForm from './useDayoutForm';

const DayoutReservation = () => {
  const {
    formData,
    customerType,
    searchTerm,
    searchResults,
    showSearchResults,
    persons,
    packages,
    selectedPackages,
    packageCategoryFilter,
    searchQuery,
    uniqueCategories,
    selectedCountry,
    emailError,
    selectedFiles,
    fileInputRef,
    handleFormChange,
    setCustomerType,
    setSearchTerm,
    handleCustomerSearch,
    handleCustomerSelect,
    setSelectedCountry,
    handleAddPerson,
    handleRemovePerson,
    handlePersonChange,
    handlePackageSelect,
    setPackageCategoryFilter,
    setSearchQuery,
    handleFileChange,
    handleSubmit,
    calculateTotalAmount
  } = useDayoutForm();

  // Helper function to format date for HTML input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      // Convert to YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = packageCategoryFilter === "all" || pkg.category === packageCategoryFilter;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">🏖️ Day Out Reservation</h2>
          
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Date and Guest Information */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>📅 Visit Information</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Visit Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="checkIn"
                        value={formatDateForInput(formData.checkIn)}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Start Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        id="startTime"
                        value={formData.startTime || ''}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">End Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        id="endTime"
                        value={formData.endTime || ''}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Adults *</label>
                      <select
                        className="form-control"
                        id="adults"
                        value={formData.adults}
                        onChange={handleFormChange}
                        required
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={`adults-${i + 1}`} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Kids</label>
                      <select
                        className="form-control"
                        id="kids"
                        value={formData.kids}
                        onChange={handleFormChange}
                      >
                        {[...Array(11)].map((_, i) => (
                          <option key={`kids-${i}`} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Type Selection */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>👤 Customer Information</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="btn-group w-100" role="group">
                        <input
                          type="radio"
                          className="btn-check"
                          name="customerType"
                          id="newCustomer"
                          checked={customerType === "new"}
                          onChange={() => setCustomerType("new")}
                        />
                        <label className="btn btn-outline-primary" htmlFor="newCustomer">
                          ➕ New Customer
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="customerType"
                          id="existingCustomer"
                          checked={customerType === "existing"}
                          onChange={() => setCustomerType("existing")}
                        />
                        <label className="btn btn-outline-success" htmlFor="existingCustomer">
                          🔍 Existing Customer
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Existing Customer Search */}
                  {customerType === "existing" && (
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, mobile, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-info w-100"
                          onClick={handleCustomerSearch}
                        >
                          🔍 Search
                        </button>
                      </div>
                      
                      {/* Search Results */}
                      {showSearchResults && (
                        <div className="col-12 mt-3">
                          <div className="card">
                            <div className="card-body">
                              <h6>Search Results:</h6>
                              {searchResults.length === 0 ? (
                                <p>No customers found</p>
                              ) : (
                                <div className="list-group">
                                  {searchResults.map((customer) => (
                                    <button
                                      key={customer._id}
                                      type="button"
                                      className="list-group-item list-group-item-action"
                                      onClick={() => handleCustomerSelect(customer)}
                                    >
                                      <strong>{customer.firstName} {customer.surname}</strong>
                                      <br />
                                      📱 {customer.mobile} | 📧 {customer.email}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer Details Form */}
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="middleName"
                        value={formData.middleName}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Surname</label>
                      <input
                        type="text"
                        className="form-control"
                        id="surname"
                        value={formData.surname}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Mobile *</label>
                      <div className="input-group">
                        <select
                          className="form-select"
                          style={{ maxWidth: '120px' }}
                          value={selectedCountry?.value || ''}
                          onChange={(e) => {
                            const country = countries.find(c => c.value === e.target.value);
                            setSelectedCountry(country);
                          }}
                        >
                          <option value="">Country</option>
                          {countries.map((country, index) => (
                            <option key={`country-${index}-${country.value}`} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          className="form-control"
                          id="mobile"
                          value={formData.mobile.split(' ')[1] || formData.mobile}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        id="email"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dob"
                        value={formatDateForInput(formData.dob)}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        id="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={formData.city}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="col-md-12">
                      <label className="form-label">Address *</label>
                      <textarea
                        className="form-control"
                        id="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        rows="2"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">ID Type *</label>
                      <select
                        className="form-control"
                        id="idType"
                        value={formData.idType}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select ID Type</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="National ID">National ID</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">ID Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-12">
                      <label className="form-label">Upload ID Files</label>
                      <input
                        type="file"
                        className="form-control"
                        ref={fileInputRef}
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                      <div className="form-text">
                        Upload images or PDF files of identification documents
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Persons */}
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5>👥 Other Persons</h5>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={handleAddPerson}
                  >
                    ➕ Add Person
                  </button>
                </div>
                <div className="card-body">
                  {persons.map((person, index) => (
                    <div key={`person-${index}`} className="mb-4 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6>Person {index + 1}</h6>
                        {persons.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemovePerson(index)}
                          >
                            ✖️ Remove
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={person.name}
                            onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-control"
                            value={person.gender}
                            onChange={(e) => handlePersonChange(index, 'gender', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            value={person.age}
                            onChange={(e) => handlePersonChange(index, 'age', e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">ID Type</label>
                          <select
                            className="form-control"
                            value={person.idType}
                            onChange={(e) => handlePersonChange(index, 'idType', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                            <option value="National ID">National ID</option>
                            <option value="Aadhar Card">Aadhar Card</option>
                            <option value="Voter ID">Voter ID</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">ID Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={person.idNo}
                            onChange={(e) => handlePersonChange(index, 'idNo', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Package Selection */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>📦 Package Selection</h5>
                </div>
                <div className="card-body">
                  {/* Package Filters */}
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <label className="form-label">Search Packages</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search packages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        value={packageCategoryFilter}
                        onChange={(e) => setPackageCategoryFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {uniqueCategories.map((category, index) => (
                          <option key={`category-${index}-${category}`} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Selected Packages</label>
                      <div className="form-control" style={{ minHeight: '38px' }}>
                        {selectedPackages.length} package(s) selected
                      </div>
                    </div>
                  </div>

                  {/* Available Packages */}
                  <div className="row">
                    {filteredPackages.length === 0 ? (
                      <div className="col-12 text-center py-4">
                        <p>No packages available</p>
                      </div>
                    ) : (
                      filteredPackages.map(pkg => (
                        <div key={pkg._id} className="col-md-6 col-lg-4 mb-3">
                          <div 
                            className={`card h-100 ${selectedPackages.includes(pkg._id) ? 'border-success' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handlePackageSelect(pkg._id)}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title">{pkg.name}</h6>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedPackages.includes(pkg._id)}
                                  onChange={() => {}}
                                />
                              </div>
                              <p className="card-text text-muted small">{pkg.description}</p>
                              <p className="card-text">
                                <strong>Category:</strong> {pkg.category}
                              </p>
                              <p className="card-text">
                                <strong className="text-success">Rs {pkg.pricePerChild}</strong> per child
                              </p>
                              {pkg.features && pkg.features.length > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">Features:</small>
                                  <ul className="list-unstyled small">
                                    {pkg.features.slice(0, 2).map((feature, index) => (
                                      <li key={`feature-${index}`}>• {feature}</li>
                                    ))}
                                    {pkg.features.length > 2 && (
                                      <li>... +{pkg.features.length - 2} more</li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5>💳 Payment Information</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Total Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">Rs</span>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.totalAmount}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa' }}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Advance Payment</label>
                      <div className="input-group">
                        <span className="input-group-text">Rs</span>
                        <input
                          type="number"
                          className="form-control"
                          id="advancePayment"
                          value={formData.advancePayment}
                          onChange={handleFormChange}
                          min="0"
                          max={formData.totalAmount}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-control"
                        id="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleFormChange}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Payment Notes</label>
                      <textarea
                        className="form-control"
                        id="paymentNotes"
                        value={formData.paymentNotes}
                        onChange={handleFormChange}
                        rows="2"
                        placeholder="Any additional payment notes..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 d-flex justify-content-end gap-3">
              <button type="button" className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                🏖️ Create Day Out Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DayoutReservation;