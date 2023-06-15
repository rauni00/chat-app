import React, { useEffect, useState } from 'react';
import PopupScreen from './Components/PopupScreen';
import ChatScreen from './Components/ChatScreeen';
let currUser = JSON.parse(localStorage.getItem('users'));
let toDelete = JSON.parse(localStorage.getItem('chatApp'));

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (toDelete) {
      localStorage.removeItem('chatApp');
    }
    if (currUser && currUser.name) {
      setUser(currUser);
    }
  }, [user]);
  return <div>{user ? <ChatScreen /> : <PopupScreen />}</div>;
};

export default App;
