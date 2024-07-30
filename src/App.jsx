import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import { Provider } from 'react-redux';
import store from './store/store';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer/>
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<RegistrationPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/' element={<LoginPage />} /> {/* Default to LoginPage */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
