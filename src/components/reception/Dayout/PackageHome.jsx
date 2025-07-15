import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class PackageHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            loading: true,
            errorMessage: "",
            searchTerm: "",
            filterCategory: "all"
        };
    }

    componentDidMount() {
        this.fetchPackages();
    }

    fetchPackages = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/packages");
            this.setState({
                packages: response.data,
                loading: false
            });
        } catch (error) {
            console.error("Error fetching packages:", error);
            this.setState({
                errorMessage: "Failed to load packages.",
                loading: false
            });
        }
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleFilterChange = (e) => {
        this.setState({ filterCategory: e.target.value });
    };

    getFilteredPackages = () => {
        const { packages, searchTerm, filterCategory } = this.state;
        return packages.filter(pkg => {
            const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === "all" || pkg.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    };

    render() {
        const { loading, errorMessage } = this.state;
        const filteredPackages = this.getFilteredPackages();

        if (loading) {
            return (
                <div className="container mt-4">
                    <div className="text-center">
                        <h3>Loading packages...</h3>
                    </div>
                </div>
            );
        }

        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="mb-4">📦 Package Management</h2>
                        
                        {/* Action Buttons */}
                        <div className="mb-4">
                            <Link to="/packages/add" className="btn btn-primary me-2">
                                ➕ Add New Package
                            </Link>
                            <button 
                                className="btn btn-secondary"
                                onClick={this.fetchPackages}
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="🔍 Search packages..."
                                    value={this.state.searchTerm}
                                    onChange={this.handleSearch}
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-control"
                                    value={this.state.filterCategory}
                                    onChange={this.handleFilterChange}
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
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        {/* Packages Grid */}
                        <div className="row">
                            {filteredPackages.length === 0 ? (
                                <div className="col-12">
                                    <div className="text-center py-5">
                                        <h4>No packages found</h4>
                                        <p>Try adjusting your search criteria or add a new package.</p>
                                    </div>
                                </div>
                            ) : (
                                filteredPackages.map(pkg => (
                                    <div key={pkg._id} className="col-md-4 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{pkg.name}</h5>
                                                <p className="card-text">{pkg.description}</p>
                                                <p className="card-text">
                                                    <strong>Category:</strong> {pkg.category}
                                                </p>
                                                <p className="card-text">
                                                    <strong>Price:</strong> Rs {pkg.pricePerChild} per child
                                                </p>
                                                {pkg.features && pkg.features.length > 0 && (
                                                    <div className="mb-3">
                                                        <strong>Features:</strong>
                                                        <ul className="list-unstyled">
                                                            {pkg.features.slice(0, 3).map((feature, index) => (
                                                                <li key={index} className="text-muted">
                                                                    • {feature}
                                                                </li>
                                                            ))}
                                                            {pkg.features.length > 3 && (
                                                                <li className="text-muted">
                                                                    ... and {pkg.features.length - 3} more
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-footer">
                                                <div className="btn-group w-100">
                                                    <Link 
                                                        to={`/packages/edit/${pkg._id}`}
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <Link 
                                                        to={`/packages/delete/${pkg._id}`}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        🗑️ Delete
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}