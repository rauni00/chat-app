import React, { useState } from 'react';
import './PopupScreen.css';
import axios from 'axios';
import baseUrl from '../baseUrl';
const PopupScreen = () => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim()) {
      axios
        .post(`${baseUrl}/addUsers`, { name: name, isActive: true })
        .then((res) => {
          if (res.data.status) {
            console.log(res.data.e);
            localStorage.setItem('users', JSON.stringify(res.data.e));
            window.location.href = '/';
            setIsOpen(false);
          }
        })
        .catch((err) => {
          setError(true);
        });
    } else {
      alert('Enter Name');
    }
  };

  return (
    <div className={`popup-screen ${isOpen ? 'open' : ''}`}>
      <div className='popup-content'>
        <h2>Welcome!</h2>
        <p>
          {error ? (
            <span style={{ color: 'red' }}> Name is Already!!</span>
          ) : (
            'Please enter your name:'
          )}
        </p>
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
