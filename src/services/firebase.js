// src/services/firebase.js - Firebase configuration and database services
import { initializeApp } from 'firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';

// Firebase configuration - these will come from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Collection reference
const goalsCollection = collection(db, 'goals');

// Firebase service functions
export const firebaseService = {
  // Subscribe to goals in real-time
  subscribeToGoals: (callback) => {
    if (!db) {
      console.error('Firebase not initialized');
      return () => {}; // Return empty unsubscribe function
    }

    try {
      // Query goals ordered by creation date (newest first)
      const q = query(goalsCollection, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const goals = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to ISO string
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };
        });
        callback(goals);
      }, (error) => {
        console.error('Error fetching goals:', error);
        callback([]); // Return empty array on error
      });
    } catch (error) {
      console.error('Error setting up subscription:', error);
      return () => {}; // Return empty unsubscribe function
    }
  },

  // Add a new goal
  addGoal: async (goalData) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = await addDoc(goalsCollection, {
        title: goalData.title.trim(),
        description: goalData.description?.trim() || '',
        priority: goalData.priority || 'medium',
        completed: false,
        createdAt: serverTimestamp()
      });
      console.log('Goal added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  // Update a goal
  updateGoal: async (goalId, updates) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Goal updated:', goalId);
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  // Delete a goal
  deleteGoal: async (goalId) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const goalRef = doc(db, 'goals', goalId);
      await deleteDoc(goalRef);
      console.log('Goal deleted:', goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Toggle goal completion status
  toggleGoal: async (goalId, currentStatus) => {
    try {
      await firebaseService.updateGoal(goalId, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling goal:', error);
      throw error;
    }
  }
};

export default firebaseService;