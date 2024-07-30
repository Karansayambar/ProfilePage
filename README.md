# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Registration Page :

- This React app allows users to register with their details and upload a profile picture. It uses Firebase for authentication and data storage.

# Features :

- Register users with email and password.
- Upload and store profile pictures.
- Store user data in Firebase Firestore.
- Use Firebase Storage for profile images.
- Includes form validation and error handling.
- Edit the form on user requirement.

# Install Dependencies :

- npm install

# Run the App:

- npm run dev

# File Structure

- components/ButtonComponent.js: Custom button component used throughout the application.
- components/Input.js: Reusable input field component for text, email, password, etc.
- pages/RegisterPage.js: Contains the registration form, handles user input, and integrates with Firebase for 0 - authentication and data storage.
- firebase.js: Firebase configuration and setup file.

# How It Works

- User Registration: Users provide their details and register using their email and password. The registration process creates a new user account in Firebase Authentication.

- Profile Picture Upload: Users can upload a profile picture. The image is stored in Firebase Storage, and its URL is saved in Firebase Firestore.

- Form Handling: Form data is managed using React's state. Validation ensures all required fields are filled and passwords match before submitting.

- Navigation: Upon successful registration, users are redirected to the profile page.

# Firebase Setup

- To use Firebase, follow these steps:
- Go to the Firebase Console.
- Create a new project or use an existing one.
- Add Firebase to your web app and copy the configuration details.
- Enable Firestore and Storage services in the Firebase Console.
