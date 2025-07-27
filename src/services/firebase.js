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
  updateDoc,
  where
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

// Export db for use in other services
export { db };

// Collection reference
const goalsCollection = collection(db, 'goals');

// Firebase service functions
export const firebaseService = {
  // Subscribe to goals for a specific user in real-time
  subscribeToGoals: (userId, callback) => {
    console.log('🔥 Setting up goals subscription for user:', userId);
    
    if (!db) {
      console.error('❌ Firebase not initialized');
      callback([]);
      return () => {};
    }

    if (!userId) {
      console.log('❌ No userId provided');
      callback([]);
      return () => {};
    }

    try {
      console.log('📋 Creating Firestore query...');
      
      // Query goals for specific user, ordered by creation date (newest first)
      const q = query(
        goalsCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      console.log('👂 Setting up onSnapshot listener...');
      
      return onSnapshot(q, 
        (snapshot) => {
          console.log('📊 Firestore snapshot received, docs:', snapshot.docs.length);
          
          const goals = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Convert Firestore timestamp to ISO string
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            };
          });
          
          console.log('✅ Goals processed:', goals.length);
          callback(goals);
        }, 
        (error) => {
          console.error('❌ Firestore subscription error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // Check for specific error types
          if (error.code === 'failed-precondition') {
            console.error('🚨 INDEX MISSING! You need to create a composite index.');
            console.error('Go to Firebase Console → Firestore → Indexes');
            console.error('Create index for collection "goals" with fields: userId (asc), createdAt (desc)');
          } else if (error.code === 'permission-denied') {
            console.error('🚨 PERMISSION DENIED! Check your Firestore security rules.');
          }
          
          callback([]); // Return empty array on error
        }
      );
    } catch (error) {
      console.error('❌ Error setting up subscription:', error);
      callback([]);
      return () => {};
    }
  },

  // Add a new goal for a specific user
  addGoal: async (goalData, userId) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const docRef = await addDoc(goalsCollection, {
        title: goalData.title.trim(),
        description: goalData.description?.trim() || '',
        priority: goalData.priority || 'medium',
        completed: false,
        userId: userId, // Associate goal with user
        
        // NEW: Timeline fields
        dueDate: goalData.dueDate || null, // ISO string or null
        goalType: goalData.goalType || 'custom', // 'daily', 'weekly', 'monthly', 'custom'
        isRecurring: goalData.isRecurring || false,
        recurringType: goalData.recurringType || null, // 'daily', 'weekly', 'monthly'
        
        createdAt: serverTimestamp()
      });
      console.log('Goal added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  // Update a goal (only if user owns it)
  updateGoal: async (goalId, updates, userId) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    if (!userId) {
      throw new Error('User ID is required');
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

  // Delete a goal (only if user owns it)
  deleteGoal: async (goalId, userId) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    if (!userId) {
      throw new Error('User ID is required');
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
  toggleGoal: async (goalId, currentStatus, userId) => {
    try {
      await firebaseService.updateGoal(goalId, {
        completed: !currentStatus
      }, userId);
    } catch (error) {
      console.error('Error toggling goal:', error);
      throw error;
    }
  }
};

export default firebaseService;