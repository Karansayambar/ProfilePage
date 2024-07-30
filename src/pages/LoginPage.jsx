import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import ButtonComponent from '../components/ButtonComponent';
import { Bars } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import "../../src/App.css"
import { toast } from 'react-toastify';

const LoginPage = () => {
  //stores email,password in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); //get data from local storage
    if(user){ // if user data found in local storage then it redirect to profile page 
      navigate("/profile"); //redirect to profile page
    }
  },[navigate])

  const handleClick = async () => {
    console.log("handling login");
    setLoading(true);//Till data get load loading component get display
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password); //get user crediantials from firebase
      const user = userCredentials.user; //user is where data is stored
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {//it checks whether data is present firestore
        localStorage.setItem("user",JSON.stringify(user)); //stores user data in localStorage
        navigate("/profile");
        toast.success("Login Successfully !");
      } else {
        setError("No user found");
        toast.error("User Not Found");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Login failed: ${error.message}`)
    } finally {// it executing every time and setLoading false
      setLoading(false);
    }

  };

  return (
    <div className=" container mt-5 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-4 offset-md-4">
          <div className="card cont p-4 border border-dark border-2">
            <div className=" card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              {/* Input component renders and send type, name, placeholder, value and onChange to Input Component */}
              <Input type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              {/* {Button Component renders and sends onClick, text, disabled to ButtonComponent} */}
              <ButtonComponent
                text={loading ? (
                  <Bars
                    height="20"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : "Login"}
                onClick={handleClick}
              />
              {/* {redirects to Register page} */}
              <div className="text-center mt-1">
                <Link to="/register" className="btn btn-link">Register If your are new on this site</Link>
              </div>              
              {error && <div className="text-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
