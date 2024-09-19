import React, { useState, useEffect } from "react";
import "../Css/ChatApp.css";
import { useFirebase } from "../Context/FirebaseContext";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

const ChatApp = () => {
  const navigate = useNavigate();
  const { user, logout } = useFirebase();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Create reference to the messages collection
  const messagesCollectionRef = collection(db, "messages");

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is not logged in
      return;
    }

    const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user, navigate, messagesCollectionRef]); // Include messagesCollectionRef in dependency array

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || !user) return; // Prevent empty messages and send if user is not logged in

    try {
      await addDoc(messagesCollectionRef, {
        text: message,
        displayName: user.displayName,
        uid: user.uid,
        createdAt: new Date(),
      });
      setMessage(""); // Clear message input
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleClearMessages = async () => {
    try {
      const querySnapshot = await getDocs(messagesCollectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error clearing messages: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate("/"); // Navigate after logout
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  if (!user) {
    return (
      <div className="chat-app">
        <header>
          <h2>Please log in to access the chat</h2>
        </header>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <header>
        <h2>Welcome, {user.displayName}</h2>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleClearMessages}>Clear Messages</button>
      </header>

      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.uid === user.uid ? "sent" : "received"}`}
          >
            <p>
              <strong>{msg.displayName}: </strong>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatApp;
