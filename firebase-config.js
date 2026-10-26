// Public Firebase WEB configuration only. Never paste service-account/private keys here.
export const firebaseConfig = {
  apiKey: 'AIzaSyBGLKZjWW8mM8vHNqkZqyjUekIeO2Oju4I',
  authDomain: 'portofolio-74488.firebaseapp.com',
  projectId: 'portofolio-74488',
  storageBucket: 'portofolio-74488.firebasestorage.app', // Copy the exact bucket from Firebase Console; optional for URL-only photos.
  messagingSenderId: '708170699029',
  appId: '1:708170699029:web:020903ec9a65662d2d991c'
};
// Copy UID of your manually created admin user from Authentication > Users.
// UID is NOT a password. The same UID MUST be in BOTH security rule files.
export const OWNER_UID = 'ndL0BJnPD4cQGma9IWTGIb7tPpo1';
export const storageEnabled = false; // Enable only after provisioning Storage & publishing its rules.
