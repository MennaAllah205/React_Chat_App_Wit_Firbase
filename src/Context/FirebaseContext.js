// FirebaseContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-in Error", error);
    }
  };

  // Handle sign-out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ user, loading, signInWithGoogle, logout }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

// Custom hook
export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export default FirebaseContext;
