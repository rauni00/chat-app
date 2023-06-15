/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './ChatScreen.css';
import Dropdown from './DropDown';
import axios from 'axios';
import baseUrl from '../baseUrl';

const Header = ({ name }) => {
  return (
    <div className='header'>
      <h2>Welcome, {name}!</h2>
    </div>
  );
};

const ChatScreen = () => {
  let currUser = JSON.parse(localStorage.getItem('users'));
  let targetUsers = JSON.parse(localStorage.getItem('targetUser'));
  const [messages, setMessages] = useState([]);
  let msg = JSON.parse(localStorage.getItem('chatMsg'));
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (msg && msg.length > 0) {
      setMessages(msg);
    }
    if (targetUsers) {
      setTargetUser(targetUsers);
    }
    // const newSocket = new WebSocket('wss://chat-app-backend-tzmq.onrender.com');
    const newSocket = new WebSocket('ws://localhost:8000');
    newSocket.onopen = () => {
      console.log('Connected to WebSocket server');
      updateIsActiveStatus(true);
    };
    newSocket.onmessage = (event) => {
      event.data.text().then((txt) => {
        const targetMessage = JSON.parse(txt);
        if (targetMessage.targetUserId === currUser._id) {
          setMessages((pre) => [
            ...pre,
            {
              ...targetMessage,
              sender:
                targetUsers._id === targetMessage.targetUserId
                  ? 'user'
                  : 'sender',
            },
          ]);
        }
      });
    };
    newSocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setSocket(null);
    };
    setSocket(newSocket);
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      updateIsActiveStatus(false);
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    getTargetUser(targetUsers);
  }, []);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const updateIsActiveStatus = (value) => {
    axios
      .post(`${baseUrl}/updateStatus/${currUser._id}`, { isActive: value })
      .then((res) => {
        localStorage.setItem('users', JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSendMessage = () => {
    if (inputValue) {
      const newMessage = {
        id: currUser._id,
        text: inputValue,
        sender: 'user',
        senderName: currUser.name,
        targetUserId: targetUsers._id,
      };
      setIsSending(true);
      setTimeout(() => {
        console.log(newMessage);
        socket.send(JSON.stringify(newMessage));
        setMessages([...messages, newMessage]);
        setInputValue('');
        setIsSending(false);
      }, 100);
    }
  };
  const getTargetUser = (obj) => {
    axios
      .get(`${baseUrl}/getStatus/${obj._id}`)
      .then((res) => {
        localStorage.setItem('targetUser', JSON.stringify(res.data));
        setTargetUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className='chat-screen'>
      <Header name={currUser.name} />
      {targetUser && targetUser.name && (
        <>
          <div
            className={`status-light ${
              targetUser.isActive ? 'online' : 'busy'
            } blink`}
          ></div>
          <span style={{ marginLeft: 10 }}>{targetUser.name}</span>
        </>
      )}
      {!targetUser && (
        <Dropdown
          onSelect={(user) => {
            getTargetUser(user);
          }}
        />
      )}
      <div className='messages'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === 'user' ? 'user' : 'sender'
            }`}
            style={
              message.sender === 'user'
                ? { alignSelf: 'flex-end' }
                : { alignSelf: 'flex-start' }
            }
          >
            <div className='message-sender'>
              {message.sender === 'user' ? 'You' : message.senderName}
            </div>
            <div className='message-text'>{message.text}</div>
          </div>
        ))}
      </div>
      <div className='input-area'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Type a message...'
          disabled={targetUsers && !targetUsers.isActive}
        />
        <button
          className={isSending ? 'send-button sending' : 'send-button'}
          onClick={handleSendMessage}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
