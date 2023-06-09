/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './ChatScreen.css';

const Header = ({ userName }) => {
  return (
    <div className='header'>
      <h2>Welcome, {userName}!</h2>
    </div>
  );
};

const ChatScreen = () => {
  let currUser = JSON.parse(localStorage.getItem('chatApp'));
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('wss://chat-app-backend-tzmq.onrender.com');
    newSocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    newSocket.onmessage = (event) => {
      event.data
        .text()
        .then((txt) =>
          setMessages((pre) => [
            ...pre,
            { ...JSON.parse(txt), sender: 'sender' },
          ])
        );
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
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue) {
      const newMessage = {
        id: currUser.id,
        text: inputValue,
        sender: 'user',
        senderName: currUser.userName,
      };

      setIsSending(true);

      setTimeout(() => {
        socket.send(JSON.stringify(newMessage));
        setMessages([...messages, newMessage]);
        setInputValue('');
        setIsSending(false);
      }, 100);
    }
  };

  return (
    <div className='chat-screen'>
      <Header userName={currUser.userName} />
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
