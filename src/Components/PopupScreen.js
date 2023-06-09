import React, { useState } from 'react';
import './PopupScreen.css';
import { v4 as uuidv4 } from 'uuid';
const PopupScreen = () => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim()) {
      localStorage.setItem(
        'chatApp',
        JSON.stringify({ id: uuidv4(), userName: name })
      );
      window.location.href = '/';
      setIsOpen(false);
    } else {
      alert('Enter Name');
    }
  };

  return (
    <div className={`popup-screen ${isOpen ? 'open' : ''}`}>
      <div className='popup-content'>
        <h2>Welcome!</h2>
        <p>Please enter your name:</p>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={name}
            onChange={handleInputChange}
            placeholder='Your name'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PopupScreen;
