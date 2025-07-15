import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { countries } from '../FormSection1/countries.jsx'; // Adjust the import path as necessary   

const DayForm = () => {
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Add reservation type
    reservationType: "overnight", // "overnight" or "dayOut"
    
    // Existing fields (same for both types)
    checkIn: "",
    checkOut: "",
    duration: "",
    adults: "1",
    kids: "0",
    firstName: "",
    mobile: "",
    email: "",
    middleName: "",
    surname: "",
    dob: "",
    address: "",
    city: "",
    gender: "",
    idType: "",
    idNumber: "",
    customerId: "",
    advancePayment: "",
    paymentMethod: "",
    paymentNotes: "",
    totalAmount: 0,
    
    // NEW: Day-out specific fields
    dayOutDate: "", // Date for day-out
    startTime: "",  // Start time for day-out
    endTime: ""     // End time for day-out
  });

  const [customerType, setCustomerType] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [persons, setPersons] = useState([{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
  
  // Existing room states
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [roomClassFilter, setRoomClassFilter] = useState("");
  
  // NEW: Package states
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [packageCategoryFilter, setPackageCategoryFilter] = useState("all");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch rooms (existing function)
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reservations/available-rooms");
      const roomsData = response.data.rooms || [];
      setRooms(roomsData);
      
      const types = [...new Set(roomsData.map(room => room.RType).filter(Boolean))];
      const classes = [...new Set(roomsData.map(room => room.RClass).filter(Boolean))];
      setUniqueTypes(types);
      setUniqueClasses(classes);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    }
  };

  // NEW: Fetch packages function
  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/packages");
      setPackages(response.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    }
  };

  // Calculate total amount for ROOMS (overnight)
  const calculateRoomTotalAmount = () => {
    if (selectedRooms.length === 0 || !formData.duration) return 0;
    
    const selectedRoomObjects = rooms.filter(room => 
      selectedRooms.includes(room.RoomNo)
    );
    
    const totalRoomPrice = selectedRoomObjects.reduce((sum, room) => {
      const roomPrice = room.RPrice || room.Price || 0;
      return sum + roomPrice;
    }, 0);
    
    return totalRoomPrice * parseInt(formData.duration);
  };

  // NEW: Calculate total amount for PACKAGES (day-out)
  const calculatePackageTotalAmount = () => {
    if (selectedPackages.length === 0) return 0;
    
    const selectedPackageObjects = packages.filter(pkg => 
      selectedPackages.includes(pkg._id)
    );
    
    const adultsCount = parseInt(formData.adults) || 0;
    const kidsCount = parseInt(formData.kids) || 0;
    const totalPersons = adultsCount + kidsCount;
    
    return selectedPackageObjects.reduce((sum, pkg) => {
      return sum + (pkg.pricePerChild * totalPersons);
    }, 0);
  };

  // Calculate total amount based on reservation type
  const calculateTotalAmount = () => {
    if (formData.reservationType === "overnight") {
      return calculateRoomTotalAmount();
    } else {
      return calculatePackageTotalAmount();
    }
  };

  // Update total amount when selections change
  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    setFormData(prev => ({ ...prev, totalAmount }));
  }, [selectedRooms, selectedPackages, formData.duration, formData.adults, formData.kids, formData.reservationType, rooms, packages]);

  // Fetch data when reservation type changes
  useEffect(() => {
    if (formData.reservationType === "overnight") {
      fetchRooms();
    } else {
      fetchPackages();
    }
  }, [formData.reservationType]);

  // Handle reservation type change
  const handleReservationTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      reservationType: type,
      totalAmount: 0
    }));
    
    // Clear selections when switching types
    setSelectedRooms([]);
    setSelectedPackages([]);
  };

  // Existing duration calculation for overnight
  useEffect(() => {
    if (formData.reservationType === "overnight") {
      const { checkIn, checkOut } = formData;
      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, duration: diff > 0 ? diff : "" }));
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.reservationType]);

  // NEW: Duration calculation for day-out (in hours)
  useEffect(() => {
    if (formData.reservationType === "dayOut") {
      const { startTime, endTime } = formData;
      if (startTime && endTime) {
        const start = new Date(`${formData.dayOutDate}T${startTime}`);
        const end = new Date(`${formData.dayOutDate}T${endTime}`);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60)); // Hours
        setFormData(prev => ({ ...prev, duration: diff > 0 ? diff : "" }));
      }
    }
  }, [formData.dayOutDate, formData.startTime, formData.endTime, formData.reservationType]);

  const handleCustomerSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const response = await axios.get(`http://localhost:8000/api/reservations/search?term=${searchTerm}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching customers:", error);
      alert("Error searching customers");
    }
  };

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customerId: customer._id,
      firstName: customer.firstName,
      middleName: customer.middleName || "",
      surname: customer.surname || "",
      mobile: customer.mobile,
      email: customer.email || "",
      dob: customer.dob || "",
      address: customer.address || "",
      city: customer.city || "",
      gender: customer.gender || "",
    });
    
    if (customer.country) {
      const country = countries.find(c => c.label === customer.country);
      if (country) setSelectedCountry(country);
    }
    
    setShowSearchResults(false);
  };

  useEffect(() => {
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        mobile: selectedCountry.value + " " + (prev.mobile.split(' ')[1] || ""),
      }));
    }
  }, [selectedCountry]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFormChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;

    setFormData(prev => ({ ...prev, [key]: value }));

    if (key === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(!emailPattern.test(value));
    }
  };

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

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  // Handle room selection (existing)
  const handleRoomSelect = (roomNo) => {
    setSelectedRooms(prev => 
      prev.includes(roomNo) 
        ? prev.filter(r => r !== roomNo) 
        : [...prev, roomNo]
    );
  };

  // NEW: Handle package selection
  const handlePackageSelect = (packageId) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(p => p !== packageId) 
        : [...prev, packageId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation based on reservation type
    if (formData.reservationType === "overnight") {
      if (selectedRooms.length === 0) {
        alert("Please select at least one room");
        return;
      }
      if (!formData.duration) {
        alert("Please select valid check-in and check-out dates");
        return;
      }
    } else {
      if (selectedPackages.length === 0) {
        alert("Please select at least one package");
        return;
      }
      if (!formData.dayOutDate || !formData.startTime || !formData.endTime) {
        alert("Please select date and time for day-out");
        return;
      }
    }
    
    try {
      const formDataToSend = new FormData();
    
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (customerType === "existing" && formData.customerId) {
        formDataToSend.append('customerId', formData.customerId);
      }
      
      formDataToSend.append('otherPersons', JSON.stringify(persons));
      
      // Add selections based on type
      if (formData.reservationType === "overnight") {
        formDataToSend.append('selectedRooms', JSON.stringify(selectedRooms));
      } else {
        formDataToSend.append('selectedPackages', JSON.stringify(selectedPackages));
      }
      
      if (formData.advancePayment) {
        formDataToSend.append('paidAmount', formData.advancePayment);
      }
      
      selectedFiles.forEach((file) => {
        formDataToSend.append('idFiles', file);
      });
      
      if (selectedCountry) {
        formDataToSend.append('country', selectedCountry.label);
        formDataToSend.append('countryCode', selectedCountry.value);
      }

      await axios.post("http://localhost:8000/api/reservations", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert(`${formData.reservationType === "overnight" ? "Room" : "Package"} reservation submitted successfully! ✅`);
      
      // Reset form
      setFormData({
        reservationType: "overnight",
        checkIn: "",
        checkOut: "",
        duration: "",
        adults: "1",
        kids: "0",
        firstName: "",
        mobile: "",
        email: "",
        middleName: "",
        surname: "",
        dob: "",
        address: "",
        city: "",
        gender: "",
        idType: "",
        idNumber: "",
        customerId: "",
        advancePayment: "",
        paymentMethod: "",
        paymentNotes: "",
        totalAmount: 0,
        dayOutDate: "",
        startTime: "",
        endTime: ""
      });
      setPersons([{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
      setSelectedCountry(null);
      setSelectedFiles([]);
      setSelectedRooms([]);
      setSelectedPackages([]);
      setCustomerType("new");
      setSearchTerm("");
      setSearchResults([]);
      setShowSearchResults(false);
      
      await fetchRooms();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error submitting reservation. Please try again. ❌");
    }
  };

  return {
    formData,
    customerType,
    searchTerm,
    searchResults,
    showSearchResults,
    persons,
    rooms,
    selectedRooms,
    packages, // NEW
    selectedPackages, // NEW
    roomTypeFilter,
    roomClassFilter,
    packageCategoryFilter, // NEW
    searchQuery,
    uniqueTypes,
    uniqueClasses,
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
    handleRoomSelect,
    handlePackageSelect, // NEW
    handleReservationTypeChange, // NEW
    setRoomTypeFilter,
    setRoomClassFilter,
    setPackageCategoryFilter, // NEW
    setSearchQuery,
    handleFileChange,
    handleSubmit,
    fetchRooms,
    fetchPackages, // NEW
    calculateTotalAmount
  };
};

export default DayForm;