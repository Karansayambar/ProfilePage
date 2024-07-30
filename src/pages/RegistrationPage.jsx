import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import ButtonComponent from "../components/ButtonComponent";
import { toast } from "react-toastify";
import { useState } from "react";

const RegisterPage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    age: "",
  });

  // State to manage profile picture
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles file input changes (profile picture)
  const handleProfileChange = (e) => {
    setProfile(e.target.files[0]);
  };

  // Handles user registration process
  const handleRegister = async () => {
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Upload profile picture and get its URL if a file is selected
      let profileUrl = "";
      if (profile) {
        const profileRef = ref(storage, `profile/${user.uid}`);
        await uploadBytes(profileRef, profile);
        profileUrl = await getDownloadURL(profileRef);
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        age: formData.age,
        profileUrl,
      });

      // Store user information in localStorage and navigate to profile page
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/profile");
      toast.success("User Registered Successfully");
    } catch (error) {
      // Handle any errors during registration
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      {/* Card container with responsive width */}
      <div className="cont card mx-auto p-4" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h2 className="card-title mb-4">Register</h2>
          
          {/* Input fields for user registration */}
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            placeholder="First Name"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            placeholder="Last Name"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="userName"
            value={formData.userName}
            placeholder="Username"
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />

          {/* Dropdown for gender selection */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control mb-3"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Input fields for date of birth and age */}
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            placeholder="Date of Birth"
            onChange={handleChange}
            className="mb-3"
          />
          <Input
            type="number"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="mb-3"
          />
          
          {/* File input for profile image */}
          <Input
            type="file"
            name="profile"
            placeholder="Profile Image"
            onChange={handleProfileChange}
          />

          {/* Register button and link to login page */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <ButtonComponent text="Register" onClick={handleRegister} />
            <Link to="/login" className="btn btn-link">Already Registered?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
