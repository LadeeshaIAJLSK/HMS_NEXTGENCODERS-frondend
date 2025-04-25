import { useEffect, useState } from "react";
import axios from "axios";

const siteLanguages = [
    { code: "af", name: "Afrikaans" }, { code: "sq", name: "Albanian" }, { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" }, { code: "hy", name: "Armenian" }, { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" }, { code: "be", name: "Belarusian" }, { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" }, { code: "bg", name: "Bulgarian" }, { code: "my", name: "Burmese" },
    { code: "ca", name: "Catalan" }, { code: "zh", name: "Chinese" }, { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" }, { code: "da", name: "Danish" }, { code: "nl", name: "Dutch" },
    { code: "en", name: "English" }, { code: "eo", name: "Esperanto" }, { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" }, { code: "fr", name: "French" }, { code: "gl", name: "Galician" },
    { code: "ka", name: "Georgian" }, { code: "de", name: "German" }, { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" }, { code: "he", name: "Hebrew" }, { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" }, { code: "is", name: "Icelandic" }, { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" }, { code: "ja", name: "Japanese" }, { code: "jv", name: "Javanese" },
    { code: "kn", name: "Kannada" }, { code: "kk", name: "Kazakh" }, { code: "km", name: "Khmer" },
    { code: "ko", name: "Korean" }, { code: "lo", name: "Lao" }, { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" }, { code: "mk", name: "Macedonian" }, { code: "ml", name: "Malayalam" },
    { code: "ms", name: "Malay" }, { code: "mr", name: "Marathi" }, { code: "mn", name: "Mongolian" },
    { code: "ne", name: "Nepali" }, { code: "no", name: "Norwegian" }, { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" }, { code: "pt", name: "Portuguese" }, { code: "pa", name: "Punjabi" },
    { code: "ro", name: "Romanian" }, { code: "ru", name: "Russian" }, { code: "sr", name: "Serbian" },
    { code: "si", name: "Sinhala" }, { code: "sk", name: "Slovak" }, { code: "sl", name: "Slovenian" },
    { code: "es", name: "Spanish" }, { code: "sw", name: "Swahili" }, { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" }, { code: "te", name: "Telugu" }, { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" }, { code: "uk", name: "Ukrainian" }, { code: "ur", name: "Urdu" },
    { code: "uz", name: "Uzbek" }, { code: "vi", name: "Vietnamese" }, { code: "xh", name: "Xhosa" },
    { code: "zu", name: "Zulu" }
].sort((a, b) => a.name.localeCompare(b.name));

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        siteTitle: "",
        siteLanguage: "en",
        hotelName: "",
        hotelEmail: "",
        hotelPhone: "",
        hotelWebsite: "",
        hotelMobile: "",
        hotelAddress: "",
        hotelTagline: "",
        gstRoom: "",
        cgstRoom:"",
        gstFood: "",
        cgstFood:"",
        gstLaundry: "",
        cgstLaundry:"",
        gstin: "",
        currency: "",
        currencySymbol: "",
        nationality: "",
        country: "",
        filterDateRange: "",
        lHeight:"",
        lWidth:""
    });

    const [error, setError] = useState(null); // State to handle errors

    // Fetch settings from backend
    useEffect(() => {
        axios.get("http://localhost:5000/api/settings")
            .then(res => setSettings(res.data))
            .catch(err => {
                console.error("Error fetching settings:", err);
                setError("Failed to load settings. Please check your connection.");
            });
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const [selectedFile, setSelectedFile] = useState(null);

const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
    }
};

    // Save updated settings
    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.put("http://localhost:5000/api/settings", settings);
            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            setError("Failed to update settings. Please try again later.");
        }
    };

    return (
        <form>
            <fieldset><h3 className="text-xl font-semibold mt-6">Site Settings</h3>
            <hr />

                {/* Site Settings */}
                <span>
                    <label>Site Page Title</label>
                    <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange} className="border p-2 w-full" />
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Site Language</label>
                    <select name="siteLanguage" value={settings.siteLanguage} onChange={handleChange} className="border p-2 w-full rounded-md">
                        {siteLanguages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Hotel Name</label>
                    <input type="text" name="hotelName" value={settings.hotelName} onChange={handleChange} className="border p-2 w-full" />
                </span>
                <br /><br />

                <span>
                    <label>Hotel Tagline</label>
                    <input type="text" name="hotelTagline" value={settings.hotelTagline} onChange={handleChange} className="border p-2 w-full" />
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Hotel Email</label>
                    <input type="email" name="hotelEmail" value={settings.hotelEmail} onChange={handleChange} className="border p-2 w-full" />
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Hotel Phone</label>
                    <input type="text" name="hotelPhone" value={settings.hotelPhone} onChange={handleChange} className="border p-2 w-full" />
                </span>
                <br /><br />

                <span>
                    <label>Hotel Mobile</label>
                    <input type="text" name="hotelMobile" value={settings.hotelMobile} onChange={handleChange} className="border p-2 w-full" />
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Hotel Website</label>
                    <input type="text" name="hotelWebsite" value={settings.hotelWebsite} onChange={handleChange} className="border p-2 w-full" />
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <label>Hotel Address</label>
                    <input type="text" name="hotelAddress" value={settings.hotelAddress} onChange={handleChange} className="border p-2 w-full" />
                </span>
            </fieldset>

            <br />

            {/* GST Settings */}
            <h3 className="text-xl font-semibold mt-6">GST Settings</h3>
            <hr />
                <span>
                <table><tr>
                    <td><label>GSTIN (%)</label></td>
                    <td colSpan="2"><input type="text" name="gstin" value={settings.gstin} onChange={handleChange} className="border p-2 w-full" /></td>
                    </tr><br />
                    <tr>
                    <td rowSpan="2"><label>Room Rent GST (%)</label></td>
                    <td>GST (%)</td><td> CGST (%)</td></tr>
                    <tr><td><input type="number" name="gstRoom" value={settings.gstRoom} onChange={handleChange} className="border p-2 w-full" /></td>
                    <td><input type="number" name="cgstRoom" value={settings.cgstRoom} onChange={handleChange} className="border p-2 w-full" />
                    </td></tr><br/>
                    
                    <tr>
                    <td rowSpan="2"><label>Food GST (%)</label></td>
                    <td>GST (%)</td><td> CGST (%)</td></tr>
                    <tr><td><input type="number" name="gstFood" value={settings.gstFood} onChange={handleChange} className="border p-2 w-full" /></td>
                    <td><input type="number" name="cgstFood" value={settings.cgstFood} onChange={handleChange} className="border p-2 w-full" />
                    </td></tr><br/>
                    
                    <tr>
                    <td rowSpan="2"><label>Laundry GST (%)</label></td>
                    <td>GST (%)</td><td> CGST (%)</td></tr>
                    <tr><td><input type="number" name="gstLaundry" value={settings.gstLaundry} onChange={handleChange} className="border p-2 w-full" /></td>
                    <td><input type="number" name="cgstLaundry" value={settings.cgstLaundry} onChange={handleChange} className="border p-2 w-full" />
                    </td></tr><br/>
                </table>
                </span>
            <br />

            {/* Currency Settings */}
            <h3 className="text-xl font-semibold mt-6">Currency Settings</h3>
            <hr />
            <fieldset>
                <div>
                    <label>Currency</label> &nbsp;&nbsp;&nbsp;
                    <input type="text" name="currency" value={settings.currency} onChange={handleChange} className="border p-2 w-full" placeholder="Rs(Srilankan Rupee)"/>
                </div>
                <br />
                <div>
                    <label>Currency Symbol</label> &nbsp;&nbsp;&nbsp;
                    <input type="text" name="currencySymbol" value= {`Rs. ${settings.currencySymbol}`} onChange={handleChange} className="border p-2 w-full"/>
                </div>
            </fieldset>
            <br />

            {/* Default Settings */}
            <h3 className="text-xl font-semibold mt-6">Default Settings</h3><hr/>
            <fieldset>
                <div>
                    <label>Nationality</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" name="nationality" value={settings.nationality} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <br />
                <div>
                    <label>Country</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" name="country" value={settings.country} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <br />
                <div>
                    <label>Default Filter Dates Range (Days)</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" name="filterDateRange" value={settings.filterDateRange} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <br/>
                <div>
                    <label>Site Logo</label>&nbsp;&nbsp;&nbsp;
                    <input type="file" id="siteLogo" name="siteLogo" className="hidden" onChange={handleFileChange} />&nbsp;&nbsp;
                       {selectedFile && <p className="mt-2"></p>}
                 </div>
                <br />
                <div>
                    <label>Logo Height(px)</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" name="lHeight" value={settings.lHeight} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <br />
                <div>
                    <label>Logo Width(px)</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" name="lWidth" value={settings.lWidth} onChange={handleChange} className="border p-2 w-full" />
                </div>
            </fieldset>

            {/* Save Button */}
            <button onClick={handleSave} className="mt-5 bg-blue-500 text-black px-4 py-2 rounded">
                Save Settings
            </button>
        </form>
    );
};

export default SettingsPage;