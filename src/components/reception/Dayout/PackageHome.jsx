import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './packageHome.css'; // Import your CSS for styling


const PackageHome = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/packages');
      setPackages(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching packages:', error);
      setErrorMessage('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const getFilteredPackages = () => {
    return packages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredPackages = getFilteredPackages();

  if (loading) {
    return (
      <div className="package-home">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading packages...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="package-home">
      <div className="container">
        <div className="header-section">
          <h2 className="page-title"> Package Management</h2>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <Link to="/packages/add" className="btn btn-primary">
               Add New Package
            </Link>
            <button className="btn btn-secondary" onClick={fetchPackages}>
               Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder=" Search packages..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-container">
            <select
              className="filter-select"
              value={filterCategory}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="family">Family</option>
              <option value="kids">Kids Only</option>
              <option value="adults">Adults Only</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {errorMessage}
          </div>
        )}

        {/* Packages Grid */}
        <div className="packages-grid">
          {filteredPackages.length === 0 ? (
            <div className="no-packages">
              <div className="no-packages-content">
                <div className="no-packages-icon"></div>
                <h4>No packages found</h4>
                <p>Try adjusting your search criteria or add a new package.</p>
                <Link to="/packages/add" className="btn btn-primary">
                  Add Your First Package
                </Link>
              </div>
            </div>
          ) : (
            filteredPackages.map(pkg => (
              <div key={pkg._id} className="package-card">
                <div className="card-header">
                  <h5 className="package-name">{pkg.name}</h5>
                  <span className={`category-badge category-${pkg.category}`}>
                    {pkg.category}
                  </span>
                </div>
                
                <div className="card-body">
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="package-price">
                    <span className="price-label">Price:</span>
                    <span className="price-value">Rs {pkg.pricePerChild}</span>
                    <span className="price-unit">per child</span>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="features-section">
                      <strong className="features-title">Features:</strong>
                      <ul className="features-list">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="feature-item">
                            • {feature}
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="feature-item more-features">
                            ... and {pkg.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div className="action-buttons-group">
                    <Link 
                      to={`/packages/edit/${pkg._id}`}
                      className="btn btn-edit"
                    >
                       Edit
                    </Link>
                    <Link 
                      to={`/packages/delete/${pkg._id}`}
                      className="btn btn-delete"
                    >
                       Delete
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageHome;