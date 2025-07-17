import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Package, CreditCard, Sun, MapPin, Star } from 'lucide-react';

const DayOutReservationForm = () => {
  const [formData, setFormData] = useState({
    reservationType: "dayOut",
    // Guest Information
    firstName: "",
    middleName: "",
    surname: "",
    mobile: "",
    email: "",
    adults: "1",
    kids: "0",
    address: "",
    city: "",
    gender: "",
    idType: "Passport",
    idNumber: "",
    
    // Day-out specific
    dayOutDate: "",
    startTime: "",
    endTime: "",
    duration: "",
    
    // Payment
    totalAmount: 0,
    advancePayment: "",
    paymentMethod: "Cash",
    paymentNotes: ""
  });

  const [selectedPackages, setSelectedPackages] = useState([]);
  const [packageCategoryFilter, setPackageCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  // Sample package data matching your API structure
  const samplePackages = [
    { 
      _id: "1", 
      name: "Beach Adventure Family Package", 
      category: "family", 
      pricePerChild: 2500, 
      description: "Perfect family day at the beach with activities for all ages",
      features: ["Beach access", "Gourmet lunch", "Beach chair", "Umbrella", "Towel service", "Kids playground", "Photo session"],
      duration: 8
    },
    { 
      _id: "2", 
      name: "Kids Water Sports Extravaganza", 
      category: "kids", 
      pricePerChild: 3200, 
      description: "Exciting water sports designed specifically for children",
      features: ["Supervised water activities", "Safety equipment", "Trained instructors", "Healthy snacks", "Games", "Certificates"],
      duration: 6
    },
    { 
      _id: "3", 
      name: "Adults Wellness Retreat", 
      category: "adults", 
      pricePerChild: 4500, 
      description: "Relaxation and wellness activities for adults only",
      features: ["Spa treatments", "Yoga sessions", "Meditation", "Healthy cuisine", "Wellness consultation", "Relaxation areas"],
      duration: 5
    },
    { 
      _id: "4", 
      name: "General Adventure Package", 
      category: "general", 
      pricePerChild: 1800, 
      description: "Mixed activities suitable for everyone",
      features: ["Multiple activity zones", "Food court access", "Basic facilities", "General entertainment", "Standard amenities"],
      duration: 7
    },
    { 
      _id: "5", 
      name: "Premium Family Experience", 
      category: "family", 
      pricePerChild: 3800, 
      description: "Luxury family package with premium services",
      features: ["VIP treatment", "Personal guide", "Premium dining", "Exclusive areas", "Professional photography", "Gift hamper"],
      duration: 8
    },
    { 
      _id: "6", 
      name: "Kids Birthday Special", 
      category: "kids", 
      pricePerChild: 2800, 
      description: "Special package for children's birthday celebrations",
      features: ["Birthday decorations", "Cake included", "Party games", "Entertainment show", "Party favors", "Special seating"],
      duration: 4
    }
  ];

  const packageCategories = [
    { value: "all", label: "All Categories", icon: "🌟" },
    { value: "general", label: "General", icon: "🎯" },
    { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
    { value: "kids", label: "Kids Only", icon: "🧒" },
    { value: "adults", label: "Adults Only", icon: "👨‍💼" }
  ];

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/packages");
        if (response.ok) {
          const data = await response.json();
          console.log("Packages fetched from API:", data);
          // Handle both direct array and object with packages property
          const packagesArray = Array.isArray(data) ? data : (data.packages || []);
          console.log("Processed packages array:", packagesArray);
          
          if (packagesArray.length > 0) {
            console.log("✅ Using REAL packages from database");
            setPackages(packagesArray);
          } else {
            console.log("⚠️ No packages found in database, using sample data");
            setPackages(samplePackages);
          }
        } else {
          console.warn("❌ Failed to fetch packages from API, using sample data");
          console.log("Sample packages will be used:", samplePackages);
          setPackages(samplePackages);
        }
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
        console.warn("Using sample data due to API error");
        console.log("Sample packages will be used:", samplePackages);
        setPackages(samplePackages);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on category
  const filteredPackages = packageCategoryFilter === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category === packageCategoryFilter);

  // Calculate duration in hours
  useEffect(() => {
    const { startTime, endTime, dayOutDate } = formData;
    if (startTime && endTime && dayOutDate) {
      const start = new Date(`${dayOutDate}T${startTime}`);
      const end = new Date(`${dayOutDate}T${endTime}`);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60));
      setFormData(prev => ({ ...prev, duration: diff > 0 ? diff : "" }));
    }
  }, [formData.dayOutDate, formData.startTime, formData.endTime]);

  // Calculate total amount based on package structure
  useEffect(() => {
    const selectedPackageObjects = packages.filter(pkg => 
      selectedPackages.includes(pkg._id)
    );
    
    // Calculate based on adults and kids
    const adults = parseInt(formData.adults) || 0;
    const kids = parseInt(formData.kids) || 0;
    
    const total = selectedPackageObjects.reduce((sum, pkg) => {
      // For adult packages, charge adults full price, kids might be discounted
      // For kids packages, charge per child
      // For family/general packages, charge per person
      
      let packageTotal = 0;
      if (pkg.category === "adults") {
        packageTotal = pkg.pricePerChild * adults; // Adults pay full price
        packageTotal += pkg.pricePerChild * 0.5 * kids; // Kids pay half price for adult packages
      } else if (pkg.category === "kids") {
        packageTotal = pkg.pricePerChild * kids; // Only kids are charged for kids packages
        packageTotal += pkg.pricePerChild * 0.3 * adults; // Adults pay minimal supervision fee
      } else {
        // General and family packages charge per person
        packageTotal = pkg.pricePerChild * (adults + kids);
      }
      
      return sum + packageTotal;
    }, 0);
    
    setFormData(prev => ({ ...prev, totalAmount: Math.round(total) }));
  }, [selectedPackages, formData.adults, formData.kids, packages]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageSelect = (packageId) => {
    console.log("Selecting package with ID:", packageId);
    console.log("Available packages:", packages);
    
    setSelectedPackages(prev => {
      const newSelection = prev.includes(packageId) 
        ? prev.filter(p => p !== packageId) 
        : [...prev, packageId];
      
      console.log("Updated selected packages:", newSelection);
      return newSelection;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Validation
      if (selectedPackages.length === 0) {
        alert("Please select at least one package");
        return;
      }
      if (!formData.dayOutDate || !formData.startTime || !formData.endTime) {
        alert("Please select date and time for day-out");
        return;
      }
      if (!formData.firstName || !formData.mobile) {
        alert("Please fill in required fields: First Name and Mobile");
        return;
      }

      // Prepare form data for submission matching the unified schema
      const submissionData = {
        reservationType: "dayOut",
        // Map day-out fields to schema fields
        checkIn: formData.dayOutDate, // Use the date for checkIn
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: parseInt(formData.duration) || 1,
        adults: parseInt(formData.adults) || 1,
        kids: parseInt(formData.kids) || 0,
        
        // Guest information
        firstName: formData.firstName,
        middleName: formData.middleName || "",
        surname: formData.surname || "",
        mobile: formData.mobile,
        email: formData.email || "",
        address: formData.address || "",
        city: formData.city || "",
        gender: formData.gender || "",
        idType: formData.idType || "Passport",
        idNumber: formData.idNumber || "",
        
        // Package selection and payment - need to stringify for backend
        selectedPackages: JSON.stringify(selectedPackages),
        selectedRooms: JSON.stringify([]), // Empty for day-out reservations
        otherPersons: JSON.stringify([]), // Empty for now
        
        // Payment information
        totalAmount: formData.totalAmount,
        advancePayment: parseFloat(formData.advancePayment) || 0,
        paidAmount: parseFloat(formData.advancePayment) || 0,
        paymentMethod: formData.paymentMethod || "Cash",
        paymentNotes: formData.paymentNotes || "",
        
        status: "Confirmed"
      };

      console.log("=== DEBUGGING PACKAGE SELECTION ===");
      console.log("Available packages:", packages);
      console.log("Selected package IDs:", selectedPackages);
      console.log("Packages being sent:", selectedPackages);
      
      // Check if selected packages exist in available packages
      const validPackages = selectedPackages.filter(id => 
        packages.some(pkg => pkg._id === id)
      );
      console.log("Valid packages found:", validPackages);
      
      if (validPackages.length !== selectedPackages.length) {
        console.error("Some selected packages don't exist in available packages!");
        console.error("Invalid package IDs:", selectedPackages.filter(id => 
          !packages.some(pkg => pkg._id === id)
        ));
      }

      console.log("Selected packages:", selectedPackages);
      console.log("Submitting day-out reservation:", submissionData);

      // Create FormData to work with your multer middleware
      const formDataForUpload = new FormData();
      
      // Add all the submission data to FormData
      Object.keys(submissionData).forEach(key => {
        formDataForUpload.append(key, submissionData[key]);
      });
      
      // Add an empty file array to prevent the multer error
      // This ensures req.files exists even when no files are uploaded
      const emptyFile = new Blob([], { type: 'text/plain' });
      formDataForUpload.append('idFiles', emptyFile, '');

      // Make actual API call to your backend using FormData
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        body: formDataForUpload
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert(`Day-out reservation created successfully! 🎉\nReservation ID: ${result.reservation._id}\nTotal Amount: Rs ${result.reservation.totalAmount}`);
        console.log("Reservation created:", result);
        
        // Reset form
        setFormData({
          reservationType: "dayOut",
          firstName: "",
          middleName: "",
          surname: "",
          mobile: "",
          email: "",
          adults: "1",
          kids: "0",
          address: "",
          city: "",
          gender: "",
          idType: "Passport",
          idNumber: "",
          dayOutDate: "",
          startTime: "",
          endTime: "",
          duration: "",
          totalAmount: 0,
          advancePayment: "",
          paymentMethod: "Cash",
          paymentNotes: ""
        });
        setSelectedPackages([]);
      } else {
        console.error("API Error Response:", result);
        console.error("Response Status:", response.status);
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to create reservation`);
      }

    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert(`Error submitting reservation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string') return "";
    
    const timeParts = time.split(":");
    if (timeParts.length < 2) return "";
    
    const [hours, minutes] = timeParts;
    const hour = parseInt(hours);
    
    if (isNaN(hour)) return "";
    
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes || '00'} ${ampm}`;
  };

  const getSelectedPackagesInfo = () => {
    return packages.filter(pkg => selectedPackages.includes(pkg._id));
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      general: "🎯",
      family: "👨‍👩‍👧‍👦",
      kids: "🧒",
      adults: "👨‍💼"
    };
    return categoryMap[category] || "📦";
  };

  const calculatePackagePrice = (pkg) => {
    const adults = parseInt(formData.adults) || 0;
    const kids = parseInt(formData.kids) || 0;
    
    if (pkg.category === "adults") {
      return `Rs ${pkg.pricePerChild * adults + pkg.pricePerChild * 0.5 * kids}`;
    } else if (pkg.category === "kids") {
      return `Rs ${pkg.pricePerChild * kids + pkg.pricePerChild * 0.3 * adults}`;
    } else {
      return `Rs ${pkg.pricePerChild * (adults + kids)}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sun className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Day-Out Package Reservation</h1>
            <Sun className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 text-lg">Create unforgettable memories with our premium day-out experiences</p>
        </div>

        {/* Day Out Schedule */}
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-orange-800">
            <Clock className="w-6 h-6" />
            Schedule Your Day-Out
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Date *</label>
              <input
                type="date"
                name="dayOutDate"
                value={formData.dayOutDate}
                onChange={handleFormChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">End Time (Departure) *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          {formData.duration && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-300">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-800 font-medium">
                  Duration: {formData.duration} hour(s)
                </p>
              </div>
              {formData.startTime && formData.endTime && (
                <p className="text-sm text-orange-700 mt-1">
                  {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Guest Information */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Users className="w-6 h-6" />
            Guest Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Adults</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleFormChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Kids</label>
              <input
                type="number"
                name="kids"
                value={formData.kids}
                onChange={handleFormChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">ID Type</label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="National ID">National ID</option>
                <option value="Aadhar Card">Aadhar Card</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-800">
            <Package className="w-6 h-6" />
            Choose Your Package
          </h2>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {packageCategories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setPackageCategoryFilter(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    packageCategoryFilter === category.value
                      ? "bg-green-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div
                key={pkg._id}
                onClick={() => handlePackageSelect(pkg._id)}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer transform hover:scale-105 ${
                  selectedPackages.includes(pkg._id)
                    ? "border-green-500 bg-green-50 shadow-xl"
                    : "border-gray-200 bg-white hover:border-green-300 hover:shadow-lg"
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getCategoryIcon(pkg.category)}</div>
                  <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 text-center mb-2">{pkg.description}</p>
                  <div className="text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {pkg.features && pkg.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                    {pkg.features && pkg.features.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        +{pkg.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Duration: {pkg.duration} hours</p>
                  <p className="text-sm text-gray-500 mb-1">Base: Rs {pkg.pricePerChild}/person</p>
                  <p className="text-lg font-bold text-green-600">{calculatePackagePrice(pkg)}</p>
                  {selectedPackages.includes(pkg._id) && (
                    <div className="mt-3 text-sm text-green-600 font-bold">✓ Selected</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Selected Packages Summary */}
          {selectedPackages.length > 0 && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
              <h3 className="font-semibold text-green-800 mb-2">Selected Packages:</h3>
              <div className="space-y-2">
                {getSelectedPackagesInfo().map(pkg => (
                  <div key={pkg._id} className="flex justify-between items-center text-sm">
                    <span className="text-green-700">{pkg.name}</span>
                    <span className="text-green-600 font-medium">{calculatePackagePrice(pkg)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <CreditCard className="w-6 h-6" />
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Total Amount</label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gradient-to-r from-green-100 to-blue-100">
                <div className="text-3xl font-bold text-green-600">
                  Rs {formData.totalAmount}
                </div>
                <div className="text-sm text-gray-600">
                  {parseInt(formData.adults)} adult(s) + {parseInt(formData.kids)} kid(s) × {selectedPackages.length} package(s)
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Advance Payment</label>
              <input
                type="number"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleFormChange}
                placeholder="Enter advance payment"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Payment Notes</label>
              <input
                type="text"
                name="paymentNotes"
                value={formData.paymentNotes}
                onChange={handleFormChange}
                placeholder="Any payment notes..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading || selectedPackages.length === 0}
            className={`px-12 py-4 rounded-xl font-bold text-lg transition-all transform ${
              loading || selectedPackages.length === 0
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              `Submit Day-Out Reservation (Rs ${formData.totalAmount})`
            )}
          </button>
          
          {selectedPackages.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one package to continue</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayOutReservationForm;