// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from 'react';
// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = new WebSocket('ws://localhost:8000');
//     newSocket.onopen = () => {
//       console.log('Connected to WebSocket server');
//     };
//     newSocket.onmessage = (event) => {
//       setMessages((pre) => [...pre, event.data]);
//     };
//     newSocket.onclose = () => {
//       console.log('Disconnected from WebSocket server');
//       setSocket(null);
//     };
//     setSocket(newSocket);
//     return () => {
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, []);

//   const sendMessage = () => {
//     if (socket && messageInput.trim() !== '') {
//       socket.send(JSON.stringify(messageInput.trim()));
//       // setMessages((prevMessages) => [
//       //   ...prevMessages,
//       //   { text: messageInput.trim() },
//       // ]);
//       // setMessages(messageInput.trim());
//       setMessages((pre) => [...pre, messageInput.trim()]);
//       setMessageInput('');
//     }
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((message, index) => (
//           <div key={message}>
//             <span>{message}</span>
//           </div>
//         ))}
//         {/* {messages} */}
//       </div>
//       <div>
//         <input
//           type='text'
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
