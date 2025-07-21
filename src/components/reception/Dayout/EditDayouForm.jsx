import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { countries } from "../FormSection1/countries";


const EditDayoutForm = ({
  selectedReservation,
  formData,
  setFormData,
  persons,
  setPersons,
  selectedPackages,
  setSelectedPackages,
  selectedCountry,
  setSelectedCountry,
  selectedFiles,
  setSelectedFiles,
  existingFiles,
  onDeleteReservation,
  onSuccess,
  onError,
  onReservationUpdate
}) => {
  const [packages, setPackages] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [packageCategoryFilter, setPackageCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const fileInputRef = useRef(null);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/packages");
        setPackages(response.data);
        
        // Extract unique categories
        const categories = [...new Set(response.data.map(pkg => pkg.category))];
        setUniqueCategories(categories);
      } catch (error) {
        console.error("Error fetching packages:", error);
        onError("Error fetching packages");
      }
    };
    
    fetchPackages();
  }, [onError]);

  // Helper function to format date for HTML input - FIXED VERSION
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      let date;
      
      // Handle different date formats
      if (typeof dateValue === 'string') {
        // Check if it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }
        
        // Handle MM-DD-YY or similar short formats
        if (/^\d{1,2}-\d{1,2}-\d{2}$/.test(dateValue)) {
          const parts = dateValue.split('-');
          let month = parts[0].padStart(2, '0');
          let day = parts[1].padStart(2, '0');
          let year = parts[2];
          
          // Convert 2-digit year to 4-digit year
          if (year.length === 2) {
            const currentYear = new Date().getFullYear();
            const currentCentury = Math.floor(currentYear / 100) * 100;
            year = currentCentury + parseInt(year);
            
            // If the year is more than 50 years in the future, assume it's from the previous century
            if (year > currentYear + 50) {
              year -= 100;
            }
          }
          
          // Create date in YYYY-MM-DD format
          const formattedDate = `${year}-${month}-${day}`;
          date = new Date(formattedDate);
        } else {
          // Try to parse as regular date string
          date = new Date(dateValue);
        }
      } else {
        date = new Date(dateValue);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date formatting error:', error, 'for value:', dateValue);
      return '';
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(value && !emailRegex.test(value) ? 'Please enter a valid email address' : '');
    }
    
    // Handle mobile field differently - store raw mobile number
    if (id === 'mobile') {
      setFormData(prev => ({ ...prev, mobile: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }

    // Calculate total amount when relevant fields change
    if (['adults', 'kids'].includes(id)) {
      setTimeout(() => calculateTotalAmount(), 0);
    }
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  const handleAddPerson = () => {
    setPersons([...persons, { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
  };

  const handleRemovePerson = (index) => {
    if (persons.length > 1) {
      setPersons(persons.filter((_, i) => i !== index));
    }
  };

  const handlePackageSelect = (packageId) => {
    const updatedPackages = selectedPackages.includes(packageId)
      ? selectedPackages.filter(id => id !== packageId)
      : [...selectedPackages, packageId];
    
    setSelectedPackages(updatedPackages);
    setTimeout(() => calculateTotalAmount(updatedPackages), 0);
  };

  const calculateTotalAmount = (packagesArray = selectedPackages) => {
    if (packagesArray.length === 0) {
      setFormData(prev => ({ ...prev, totalAmount: 0 }));
      return;
    }

    const selectedPackageObjects = packages.filter(pkg => packagesArray.includes(pkg._id));
    const adults = parseInt(formData.adults) || 1;
    const kids = parseInt(formData.kids) || 0;

    const totalAmount = selectedPackageObjects.reduce((sum, pkg) => {
      let packageTotal = 0;
      
      if (pkg.category === 'adults') {
        packageTotal = pkg.pricePerChild * adults;
        packageTotal += pkg.pricePerChild * 0.5 * kids;
      } else if (pkg.category === 'kids') {
        packageTotal = pkg.pricePerChild * kids;
        packageTotal += pkg.pricePerChild * 0.3 * adults;
      } else {
        packageTotal = pkg.pricePerChild * (adults + kids);
      }
      
      return sum + packageTotal;
    }, 0);

    setFormData(prev => ({ ...prev, totalAmount: Math.round(totalAmount) }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Helper function to get mobile number with country code
  const getFullMobileNumber = () => {
    const countryCode = selectedCountry?.value || '';
    const mobileNumber = formData.mobile || '';
    
    // If mobile already has country code, return as is
    if (mobileNumber.includes('+') || !countryCode) {
      return mobileNumber;
    }
    
    // Combine country code with mobile number
    return `${countryCode} ${mobileNumber}`;
  };

  // Helper function to extract only package IDs
  const getPackageIds = (packages) => {
    return packages.map(pkg => {
      // If it's already just an ID string, return it
      if (typeof pkg === 'string') {
        return pkg;
      }
      // If it's an object with _id, extract the _id
      if (pkg && typeof pkg === 'object' && pkg._id) {
        return pkg._id;
      }
      // If it's an object with id, extract the id
      if (pkg && typeof pkg === 'object' && pkg.id) {
        return pkg.id;
      }
      // Fallback - return as is
      return pkg;
    }).filter(id => id); // Remove any null/undefined values
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the full mobile number
    const fullMobile = getFullMobileNumber();
    
    // Validate required fields BEFORE creating FormData
    if (!formData.firstName || formData.firstName.trim() === '') {
      onError("First Name is required");
      return;
    }
    
    if (!fullMobile || fullMobile.trim() === '') {
      onError("Mobile number is required");
      return;
    }
    
    if (!formData.checkIn) {
      onError("Visit Date is required");
      return;
    }
    
    if (emailError) {
      onError("Please fix email validation error before submitting");
      return;
    }

    if (!selectedPackages || selectedPackages.length === 0) {
      onError("Please select at least one package");
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add basic form fields - always add required fields
      formDataToSend.append('firstName', (formData.firstName || '').trim());
      formDataToSend.append('mobile', fullMobile.trim());
      formDataToSend.append('checkIn', formData.checkIn || '');
      
      // Add optional fields only if they have values
      if (formData.middleName && formData.middleName.trim()) {
        formDataToSend.append('middleName', formData.middleName.trim());
      }
      if (formData.surname && formData.surname.trim()) {
        formDataToSend.append('surname', formData.surname.trim());
      }
      if (formData.email && formData.email.trim()) {
        formDataToSend.append('email', formData.email.trim());
      }
      if (formData.startTime) {
        formDataToSend.append('startTime', formData.startTime);
      }
      if (formData.endTime) {
        formDataToSend.append('endTime', formData.endTime);
      }
      
      // Add numeric fields
      formDataToSend.append('adults', parseInt(formData.adults) || 1);
      formDataToSend.append('kids', parseInt(formData.kids) || 0);
      
      // Add other optional fields
      if (formData.dob) {
        formDataToSend.append('dob', formData.dob);
      }
      if (formData.gender) {
        formDataToSend.append('gender', formData.gender);
      }
      if (formData.city && formData.city.trim()) {
        formDataToSend.append('city', formData.city.trim());
      }
      if (formData.address && formData.address.trim()) {
        formDataToSend.append('address', formData.address.trim());
      }
      if (formData.idType) {
        formDataToSend.append('idType', formData.idType);
      }
      if (formData.idNumber && formData.idNumber.trim()) {
        formDataToSend.append('idNumber', formData.idNumber.trim());
      }
      
      // Add payment fields
      formDataToSend.append('totalAmount', parseFloat(formData.totalAmount) || 0);
      formDataToSend.append('paidAmount', parseFloat(formData.paidAmount) || 0);
      
      if (formData.paymentMethod) {
        formDataToSend.append('paymentMethod', formData.paymentMethod);
      }
      
      formDataToSend.append('paymentStatus', formData.paymentStatus || 'Pending');
      
      if (formData.paymentNotes && formData.paymentNotes.trim()) {
        formDataToSend.append('paymentNotes', formData.paymentNotes.trim());
      }
      
      // Add reservation type
      formDataToSend.append('reservationType', 'dayOut');
      
      // Extract only package IDs and add them as JSON string
      const packageIds = getPackageIds(selectedPackages);
      console.log('Package IDs being sent:', packageIds);
      formDataToSend.append('selectedPackages', JSON.stringify(packageIds));
      
      // Add other persons (only those with names)
      const validPersons = persons.filter(person => person.name && person.name.trim() !== '');
      if (validPersons.length > 0) {
        // Clean up person objects to only include necessary fields
        const cleanedPersons = validPersons.map(person => ({
          name: person.name,
          gender: person.gender || '',
          age: person.age || '',
          address: person.address || '',
          idType: person.idType || '',
          idNo: person.idNo || ''
        }));
        formDataToSend.append('otherPersons', JSON.stringify(cleanedPersons));
      }
      
      // Add country code if selected
      if (selectedCountry?.value) {
        formDataToSend.append('countryCode', selectedCountry.value);
      }
      
      // Add files if any
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formDataToSend.append('idFiles', file);
        });
      }

      // Debug: Log FormData contents
      console.log('FormData contents before sending:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await axios.put(
        `http://localhost:8000/api/reservations/${selectedReservation._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onSuccess("Day-out reservation updated successfully!");
      if (onReservationUpdate && typeof onReservationUpdate === 'function') {
        onReservationUpdate(response.data);
      }
      
    } catch (error) {
      console.error("Error updating reservation:", error);
      console.error("Error response:", error.response?.data);
      onError(error.response?.data?.message || "Error updating reservation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter packages based on search and category
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = packageCategoryFilter === "all" || pkg.category === packageCategoryFilter;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract mobile number without country code for display
  const getMobileNumberForDisplay = () => {
    const mobile = formData.mobile || '';
    const countryCode = selectedCountry?.value || '';
    
    if (countryCode && mobile.startsWith(countryCode)) {
      return mobile.replace(countryCode, '').trim();
    }
    
    // If mobile has a country code but it's different from selected country
    if (mobile.includes('+') && countryCode) {
      const parts = mobile.split(' ');
      return parts.length > 1 ? parts.slice(1).join(' ') : mobile;
    }
    
    return mobile;
  };

  // Helper function to get package ID for selection check
  const getPackageId = (pkg) => {
    if (typeof pkg === 'string') return pkg;
    if (pkg && typeof pkg === 'object') return pkg._id || pkg.id;
    return pkg;
  };

  // Check if a package is selected
  const isPackageSelected = (packageId) => {
    return selectedPackages.some(pkg => getPackageId(pkg) === packageId);
  };

  return (
    <div className="edit-dayout-form">
      <div className="form-header">
        <h2>🏖️ Edit Day Out Reservation</h2>
        <p className="text-muted">Reservation ID: {selectedReservation._id}</p>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Visit Information */}
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
                    value={formData.adults || 1}
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
                    value={formData.kids || 0}
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

        {/* Customer Information */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>👤 Customer Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={formData.firstName || ''}
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
                    value={formData.middleName || ''}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Surname</label>
                  <input
                    type="text"
                    className="form-control"
                    id="surname"
                    value={formData.surname || ''}
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
                      value={getMobileNumberForDisplay()}
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
                    value={formData.email || ''}
                    onChange={handleFormChange}
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
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
                    value={formData.gender || ''}
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
                    value={formData.city || ''}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    id="address"
                    value={formData.address || ''}
                    onChange={handleFormChange}
                    rows="2"
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">ID Type</label>
                  <select
                    className="form-control"
                    id="idType"
                    value={formData.idType || ''}
                    onChange={handleFormChange}
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
                  <label className="form-label">ID Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idNumber"
                    value={formData.idNumber || ''}
                    onChange={handleFormChange}
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
                  
                  {existingFiles && existingFiles.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Existing files:</small>
                      <ul className="list-unstyled small">
                        {existingFiles.map((file, index) => (
                          <li key={index} className="text-success">
                            📎 {file.split('/').pop()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                        value={person.name || ''}
                        onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={person.gender || ''}
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
                        value={person.age || ''}
                        onChange={(e) => handlePersonChange(index, 'age', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">ID Type</label>
                      <select
                        className="form-control"
                        value={person.idType || ''}
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
                        value={person.idNo || ''}
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
                            <strong className="text-success">Rs {pkg.pricePerChild}</strong> per person
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
                      value={formData.totalAmount || 0}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Paid Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">Rs</span>
                    <input
                      type="number"
                      className="form-control"
                      id="paidAmount"
                      value={formData.paidAmount || 0}
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
                    value={formData.paymentMethod || ''}
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
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-control"
                    id="paymentStatus"
                    value={formData.paymentStatus || 'Pending'}
                    onChange={handleFormChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                
                <div className="col-md-12">
                  <label className="form-label">Payment Notes</label>
                  <textarea
                    className="form-control"
                    id="paymentNotes"
                    value={formData.paymentNotes || ''}
                    onChange={handleFormChange}
                    rows="2"
                    placeholder="Any additional payment notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-12 d-flex justify-content-between">
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={onDeleteReservation}
          >
            🗑️ Delete Reservation
          </button>
          
          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : '💾 Update Reservation'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDayoutForm;