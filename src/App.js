// App.js
import React from "react";
import { FirebaseProvider } from "./Context/FirebaseContext";
import Login from "./Components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from "./Components/ChatApp";

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
