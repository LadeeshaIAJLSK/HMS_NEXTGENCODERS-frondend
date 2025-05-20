import React, { useState, useEffect } from 'react';
import './TimezoneClock.css';

const TimezoneClock = () => {
  const countries = [
    { name: 'Local', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, code: 'local' },
    { name: 'New York, USA', timezone: 'America/New_York', code: 'us' },
    { name: 'London, UK', timezone: 'Europe/London', code: 'gb' },
    { name: 'Dubai, UAE', timezone: 'Asia/Dubai', code: 'ae' },
    { name: 'Tokyo, Japan', timezone: 'Asia/Tokyo', code: 'jp' },
    { name: 'Sydney, Australia', timezone: 'Australia/Sydney', code: 'au' },
    { name: 'Paris, France', timezone: 'Europe/Paris', code: 'fr' },
    { name: 'Berlin, Germany', timezone: 'Europe/Berlin', code: 'de' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnalog, setIsAnalog] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCountryChange = (e) => {
    const selectedCode = e.target.value;
    const country = countries.find(c => c.code === selectedCode);
    setSelectedCountry(country);
  };

  const getTimeForTimezone = () => {
    return new Date(currentTime.toLocaleString('en-US', { timeZone: selectedCountry.timezone }));
  };

  const time = getTimeForTimezone();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hoursDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minutesDegrees = minutes * 6;
  const secondsDegrees = seconds * 6;

  return (
    <div className="world-clock-container">
      <div className="clock-header">
        <div className="controls">
          <select 
            value={selectedCountry.code} 
            onChange={handleCountryChange}
            className="country-selector"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => setIsAnalog(!isAnalog)} 
            className="toggle-button"
          >
            {isAnalog ? ' Digital' : ' Analog'}
          </button>
        </div>
      </div>

      <div className="clock-display">
        {isAnalog ? (
          <div className="analog-clock-container">
            <div className="analog-clock">
              <div className="clock-face">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="hour-mark" 
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  >
                    <div className="hour-number" style={{ transform: `rotate(-${i * 30}deg)` }}>
                      {i === 0 ? 12 : i}
                    </div>
                  </div>
                ))}
                <div 
                  className="hand hour-hand" 
                  style={{ transform: `rotate(${hoursDegrees}deg)` }}
                ></div>
                <div 
                  className="hand minute-hand" 
                  style={{ transform: `rotate(${minutesDegrees}deg)` }}
                ></div>
                <div 
                  className="hand second-hand" 
                  style={{ transform: `rotate(${secondsDegrees}deg)` }}
                ></div>
                <div className="center-circle"></div>
              </div>
            </div>
            <div className="clock-info">
              <div className="location">{selectedCountry.name}</div>
            </div>
          </div>
        ) : (
          <div className="digital-clock-container">
            <div className="digital-time">
              {time.toLocaleTimeString('en-US', { hour12: true })}
            </div>
            <div className="location">{selectedCountry.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneClock;
