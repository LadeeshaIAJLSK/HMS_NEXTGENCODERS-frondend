import React, { useState, useEffect } from 'react';
import { UilAngleLeft, UilAngleRight, UilPlus, UilTrashAlt } from '@iconscout/react-unicons';
import './Calenderview.css';

const Calenderview = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    time: ''
  });
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setNewEvent(prev => ({
      ...prev,
      date: clickedDate.toISOString().split('T')[0]
    }));
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim() === '') return;

    const eventDate = new Date(newEvent.date);
    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
      day: eventDate.getDate(),
      month: eventDate.getMonth(),
      year: eventDate.getFullYear()
    };

    setEvents([...events, eventToAdd]);
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      title: '',
      time: ''
    });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    dayNames.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="day-name">
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;
      const isToday = new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      const dayEvents = events.filter(event =>
        event.day === day &&
        event.month === month &&
        event.year === year
      );

      const date = new Date(year, month, day);
      const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={`day-${day}`}
          className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPastDate ? 'past' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {dayEvents.length > 0 && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.year, event.month, event.day);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    return eventDate >= today;
  }).sort((a, b) => {
    const dateA = new Date(a.year, a.month, a.day);
    const dateB = new Date(b.year, b.month, b.day);
    return dateA - dateB;
  });

  return (
    <div className="hotel-calendar">
      <div className="calendar-header">
        <h3>Calendar</h3>
        <div className="month-navigation">
          <button onClick={handlePrevMonth} className="nav-btn">
            <UilAngleLeft />
          </button>

          <select
            value={currentDate.getMonth()}
            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={currentDate.getFullYear()}
            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
          >
            {Array.from({ length: 40 }).map((_, i) => {
              const year = 2000 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <button onClick={handleNextMonth} className="nav-btn">
            <UilAngleRight />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {renderCalendar()}
      </div>

      <div className="calendar-events">
        <div className="events-header">
          <div className="event-title">Upcoming Events</div>
          <button className="add-event-btn" onClick={() => setShowEventForm(!showEventForm)}>
            <UilPlus />
          </button>
        </div>

        {showEventForm && (
          <div className="event-form">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="time"
              placeholder="Time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
            <button onClick={handleAddEvent}>Add Event</button>
          </div>
        )}

        {upcomingEvents.length === 0 ? (
          <div className="no-events">No upcoming events</div>
        ) : (
          upcomingEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-date">{event.day}th</div>
              <div className="event-details">
                <div className="event-name">{event.title}</div>
                {event.time && <div className="event-time">{event.time}</div>}
              </div>
              <button className="delete-event-btn" onClick={() => handleDeleteEvent(event.id)}>
                <UilTrashAlt size="16" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calenderview;