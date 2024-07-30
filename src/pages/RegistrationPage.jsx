import { Bars } from "react-loader-spinner";
import ButtonComponent from "../components/ButtonComponent";
import Input from "../components/Input";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

const RegistrationPage = () => {
  //state management store data in this variables using useState
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState("");
  const [gender, setGender] = useState('');
  const [DOB, setDOB] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleClick = async () => {// asyncronus function is called after clicking on register button
    console.log("handle login");
    setLoading(true);
    setError('');

    if (password !== confirmPassword) { //password validatation
      setError("Passwords should match");
      setLoading(false);
      return;
    } else if (!email || !password || !confirmPassword || !firstName || !lastName || !userName || !age || !gender || !DOB) { //checks all fields are required
      setError("All fields are required");
      setLoading(false);
      return;
    } else if (password.length < 6) { //password validation
      setError("Password should be greater than 6 characters");
      setLoading(false);
      return;
    } 

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      let profileUrl = "";
      if (profile) {
        const profileRef = ref(storage, `profile/${user.uid}`);
        await uploadBytes(profileRef, profile);
        profileUrl = await getDownloadURL(profileRef);


      await setDoc(doc(db, "users", user.uid), { //arrange data in storage of firebase in document format
        firstName,
        lastName,
        userName,
        email,
        gender,
        dob: DOB,
        age,
        profileUrl,
      });

      navigate("/profile");
      toast.success("User Register Successfully")
      console.log("user", user);
    }
    } catch (error) {
      toast.error(error.message)
      console.log("error", error);
      toast.error(error.message)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-4 offset-md-4">
          <div className="card cont p-2 border border-dark border-2">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Register Page</h3>
              <div className="d-flex gap-3">
              {/* Input component renders and send type, name, placeholder, value and onChange to Input Component */}
                <Input type="text" name="firstName" value={firstName} placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
                <Input type="text" name="lastName" value={lastName} placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <Input type="text" name="userName" value={userName} placeholder="User Name" onChange={(e) => setUserName(e.target.value)} required />
              <Input type="email" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
              <div className="d-flex gap-3">
                <Input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <Input type="password" name="confirmPassword" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="d-flex gap-3">
                <Input type="date" name="DOB" value={DOB} placeholder="DOB" onChange={(e) => setDOB(e.target.value)} required />
                <Input type="number" name="age" value={age} placeholder="Age" onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div className="form-group mb-3 d-flex align-items-center justify-content-center gap-3">
                <div>
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="" disabled>Select Your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input className="p-0 m-0 w-75px" type="file" name="profile" placeholder="Profile Image" onChange={(e) => setProfile(e.target.files[0])} required />
              </div>
              <div>
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
                ) : "Sign up"}
                onClick={handleClick}
              />
              <div className="text-center mt-1">
                <Link to="/login" className="btn btn-link">Alredy Register go to login page</Link>
              </div>              
              </div>
              {error && <div className="text-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
