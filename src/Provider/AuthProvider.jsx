import React, { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  updateProfile,
} from 'firebase/auth';
import app from '../Utils/Firebase';
import axios from 'axios'; 
import { toast } from 'react-toastify';

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (profile) => {
    return updateProfile(auth.currentUser, {
      displayName: profile?.displayName,
      photoURL: profile?.photoURL,
    });
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = () => {
    return signOut(auth)
      .then(() => {
        setUser(null);
        toast('User logged out successfully!', {
          position: 'top-right',
          autoClose: 5000,
          theme: 'light',
        });
      })
      .catch((error) => {
        toast(error.message, {
          position: 'top-right',
          autoClose: 5000,
          theme: 'light',
        });
      });
  };

  const googleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        toast.error(
          `Account exists with ${email}. Use: ${methods.join(', ')}`
        );
      } else {
        toast.error(error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const githubSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      return result;
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        toast.error(
          `Account exists with ${email}. Use: ${methods.join(', ')}`
        );
      } else {
        toast.error(error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URI}api/user/${currentUser.email}`,
            { withCredentials: true }
          );

          const dbUser = res.data;
          setUserId(dbUser._id)        
          setUser({
            uid: dbUser._id,
            email: dbUser.email,
            displayName: dbUser.name,
            photoURL: dbUser.image,
            role: dbUser.role || 'user', 
          });
   
        } catch (error) {
       
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    setUser,
    userId,
    setUserId,
    loading,
    createUser,
    loginUser,
    handleLogout,
    googleSignup,
    githubSignup,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
