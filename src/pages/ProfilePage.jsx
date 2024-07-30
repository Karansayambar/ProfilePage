import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../store/userSlice";
import { BallTriangle } from "react-loader-spinner";
import Input from "../components/Input";
import ButtonComponent from "../components/ButtonComponent";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../src/App.css";

const ProfilePage = () => {
  const { userData, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  // Fetch user data on component mount or when `userData` changes
  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
      } else if (user && !userData) {
        await dispatch(fetchUser(user.uid));
      }
    };
    fetchUserData();
  }, [userData, dispatch, navigate]);

  // Set form data when in edit mode
  useEffect(() => {
    if (editMode && userData) {
      setFormData(userData);
    }
  }, [editMode, userData]);

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
        />
      </div>
    );
  }

  // Display error message if there was an error fetching data
  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle changes in profile picture file input
  const handleProfilePictureChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  // Save profile changes
  const handleSave = async () => {
    let profileUrl = formData.profileUrl;

    // Upload new profile picture if selected
    if (newProfilePicture) {
      const profileRef = ref(storage, `profile/${auth.currentUser.uid}`);
      await uploadBytes(profileRef, newProfilePicture);
      profileUrl = await getDownloadURL(profileRef);
    }

    // Update user data in the store
    await dispatch(updateUser({ ...formData, profileUrl }));
    setEditMode(false);
  };

  // Logout the user
  const handleLogout = () => {
    localStorage.removeItem("user");
    auth.signOut();
    navigate("/login");
    toast.success("User Logged Out Successfully");
  };

  return (
    <div className="container mx-auto mt-5">
      {userData ? (
        <div className="cont card p-4">
          <div className="card-body d-flex flex-column gap-lg-4">
            <div>
              <h2 className="card-title">Profile Details</h2>
              {editMode ? (
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    placeholder="First Name"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    placeholder="Last Name"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <Input
                    type="text"
                    name="userName"
                    value={formData.userName || ""}
                    placeholder="Username"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="form-control mb-3"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    placeholder="Date of Birth"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <Input
                    type="number"
                    name="age"
                    value={formData.age || ""}
                    placeholder="Age"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <div className="form-group mb-3">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      name="profilePicture"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                  {formData.profileUrl && (
                    <div className="mb-3">
                      <img
                        src={formData.profileUrl}
                        alt="Profile"
                        className="img img-fluid"
                      />
                    </div>
                  )}
                  <ButtonComponent text="Save" onClick={handleSave} />
                </div>
              ) : (
                <div>
                  {userData.profileUrl && (
                    <div className="profile-img mb-3">
                      <img
                        src={userData.profileUrl}
                        alt="Profile"
                        className="img-fluid img"
                      />
                    </div>
                  )}
                  <div>
                    <p><strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Username:</strong> {userData.userName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Gender:</strong> {userData.gender}</p>
                    <p><strong>Date of Birth:</strong> {userData.dob}</p>
                    <p><strong>Age:</strong> {userData.age}</p>
                  </div>
                  <ButtonComponent
                    text="Edit"
                    onClick={() => setEditMode(true)}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            <ButtonComponent
              text="Logout"
              onClick={handleLogout}
              className="mt-3"
            />
          </div>
        </div>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default ProfilePage;
