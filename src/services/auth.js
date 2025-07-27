// src/services/auth.js - Firebase authentication service
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to authentication state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Sign up with email and password
  signUp: async (email, password, displayName) => {
    try {
      console.log('🆕 Creating account for:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        console.log('📝 Updating profile with display name:', displayName);
        await updateProfile(result.user, { displayName });
      }

      // Create user document in Firestore
      console.log('📄 Creating user document in Firestore');
      await authService.createUserDocument(result.user, { displayName });
      
      console.log('✅ Account created successfully');
      return { user: result.user, error: null };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = error.message;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try signing in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password sign up is not enabled. Please contact support.';
          break;
        default:
          errorMessage = `Sign up failed: ${error.message}`;
      }
      
      return { user: null, error: errorMessage };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('🔑 Signing in user:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Sign in successful');
      return { user: result.user, error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = error.message;
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please wait a moment and try again.';
          break;
        default:
          errorMessage = `Sign in failed: ${error.message}`;
      }
      
      return { user: null, error: errorMessage };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user document if it doesn't exist
      await authService.createUserDocument(result.user);
      
      return { user: result.user, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { user: null, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error.message };
    }
  },

  // Create user document in Firestore
  createUserDocument: async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  },

  // Get user document from Firestore
  getUserDocument: async (uid) => {
    if (!uid) return null;
    
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? { uid, ...userDoc.data() } : null;
    } catch (error) {
      console.error('Error getting user document:', error);
      return null;
    }
  }
};

export default authService;