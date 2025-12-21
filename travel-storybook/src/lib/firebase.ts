import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase 설정 (환경 변수로 관리하는 것을 권장합니다)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Firebase 초기화
console.log('🔥 Firebase 초기화 시작...');
console.log('Config:', {
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log('✅ Firebase 초기화 성공!');
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error);
  // 더미 객체로 대체 (타입 안전성을 위해)
  const dummyApp = initializeApp({
    apiKey: 'dummy',
    authDomain: 'dummy',
    projectId: 'dummy',
    storageBucket: 'dummy',
    messagingSenderId: 'dummy',
    appId: 'dummy',
  });
  auth = getAuth(dummyApp);
  db = getFirestore(dummyApp);
  storage = getStorage(dummyApp);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, storage, googleProvider };

