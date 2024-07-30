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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      navigate("/profile");
    }
  },[navigate])

  const handleClick = async () => {
    console.log("handling login");
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        localStorage.setItem("user",JSON.stringify(user));
        navigate("/profile");
        toast.success("Login Successfully !");
      } else {
        setError("No user found");
        toast.error("User Not Found");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Login failed: ${error.message}`)
    } finally {
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
              <Input type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
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
