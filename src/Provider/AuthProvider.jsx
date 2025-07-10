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
import { toast } from 'react-toastify';

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    

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
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
                
            })
            .catch((error) => {
                toast(error.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
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
                const pendingCred = error.credential;

                const methods = await fetchSignInMethodsForEmail(auth, email);

                toast.error(
                    `An account already exists with the email ${email}. Please sign in using: ${methods.join(', ')}`
                );

                // You could optionally prompt user to sign in with the first method and link accounts here
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
                const pendingCred = error.credential;

                const methods = await fetchSignInMethodsForEmail(auth, email);

                toast.error(
                    `An account already exists with the email ${email}. Please sign in using: ${methods.join(', ')}`
                );

                // Optionally: prompt user to login with existing provider and link accounts here

            } else {
                toast.error(error.message);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authData = {
        user,
        setUser,      
        loading,
        createUser,
        loginUser,
        handleLogout,
        googleSignup,
        githubSignup,
        updateUser,
    };

    return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
