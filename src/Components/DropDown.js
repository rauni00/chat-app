import React, { useEffect, useState } from 'react';
import './Dropdown.css';
import axios from 'axios';
import baseUrl from '../baseUrl';
const Dropdown = ({ onSelect }) => {
  let currUser = JSON.parse(localStorage.getItem('users'));
  const [selectedOption, setSelectedOption] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}/allUsers`).then((res) => {
      if (res.data.status) {
        const allUsers = res.data.users.filter(
          (obj) => obj._id !== currUser._id
        );
        setAllUsers(allUsers);
      }
    });
  }, []);
  const handleOptionSelect = (option) => {
    let user = JSON.parse(option);
    setSelectedOption(user);
    onSelect(user);
  };

  return (
    <div className='dropdown-container'>
      <select
        className='dropdown-select'
        value={selectedOption}
        onChange={(e) => handleOptionSelect(e.target.value)}
      >
        <option defaultChecked>Select an option</option>
        {allUsers &&
          allUsers.length > 0 &&
          allUsers.map((option) => (
            <option
              key={option.id}
              value={JSON.stringify(option)}
              id={option.id}
            >
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Dropdown;
