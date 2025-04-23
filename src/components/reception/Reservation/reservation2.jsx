import React, { useState } from "react";
import "./reservation2.css";

const Reservation2 = () => {
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        alert(files.length > 0 ? `${files.length} file(s) selected` : "No file chosen");
    };

    return (
        <div className="container">
            <h2>ID Card Information</h2>
            <form>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Type of ID <span className="required">*</span></label>
                        <select 
                            name="idcard_type" 
                            id="idcard_type" 
                            value={idType} 
                            onChange={(e) => setIdType(e.target.value)}
                            className={idType ? "filled" : ""}
                        >
                            <option value="">--Select--</option>
                            <option value="4">Passport</option>
                            <option value="5">Driving License</option>
                            <option value="6">Aadhar Card</option>
                            <option value="7">Voter ID</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ID No. <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="idcard_no" 
                            placeholder="Enter ID No." 
                            id="idcard_no" 
                            value={idNumber} 
                            onChange={(e) => setIdNumber(e.target.value)}
                            className={idNumber ? "filled" : ""}
                        />
                    </div>
                    <div className="form-group">
                        <label>Upload ID Card <sup className="required">Multiple</sup></label>
                        <input 
                            type="file" 
                            multiple 
                            name="id_image[]" 
                            id="idcard_image" 
                            onChange={handleFileChange} 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Reservation2;
