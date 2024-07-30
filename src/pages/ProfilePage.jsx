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
import "../../src/App.css"

const ProfilePage = () => {
  const { userData, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      navigate("/login");
    }else if(user && !userData){
      // dispatch(fetchUser(user.uid));
       setTimeout(() => {
            dispatch(fetchUser(user.uid));
      }, 1000)
    }
  }, [userData, dispatch, navigate]);

  useEffect(() => {
    if (editMode && userData) {
      setFormData(userData);
    }
  }, [editMode, userData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 mx-auto">
        <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfilePictureChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  const handleSave = async () => {
    let profileUrl = formData.profileUrl;

    if (newProfilePicture) {
      const profileRef = ref(storage, `profile/${userData.uid}`);
      await uploadBytes(profileRef, newProfilePicture);
      profileUrl = await getDownloadURL(profileRef);
    }

    dispatch(updateUser({ ...formData, profileUrl }));
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    auth.signOut();
    navigate("/login")
    toast.success("User LoggedOut Successfully")
  }

  return (
    <div className="container mx-auto mt-5">
      {userData ? (
        <div className="card cont w-100 p-4">
          <div className="card-body gap-lg-4 w-100 justify-content-between">
            <div>
              <h2 className="card-title">Profile Details</h2>
              {editMode ? (
                <div>
                  <Input type="text" name="firstName" value={formData.firstName || ''} placeholder="First Name" onChange={handleChange} />
                  <Input type="text" name="lastName" value={formData.lastName || ''} placeholder="Last Name" onChange={handleChange} />
                  <Input type="text" name="userName" value={formData.userName || ''} placeholder="Username" onChange={handleChange} />
                  <Input type="text" name="gender" value={formData.gender || ''} placeholder="Gender" onChange={handleChange} />
                  <Input type="date" name="dob" value={formData.dob || ''} placeholder="Date of Birth" onChange={handleChange} />
                  <Input type="number" name="age" value={formData.age || ''} placeholder="Age" onChange={handleChange} />
                  <div className="form-group mb-1 mt-2">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      name="profilePicture"
                      onChange={handleProfilePictureChange}
                      aria-label="profilePicture"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  {formData.profileUrl && (
                    <div>
                      <img src={formData.profileUrl} alt="Profile" className="img-fluid" />
                    </div>
                  )}
                  <ButtonComponent text="Save" onClick={handleSave} />
                </div>
              ) : (
                <div>
                  {userData.profileUrl && (
              <div className="profile-img m-2 h-25 w-25 md-w-100 md-h-100">
                <img src={userData.profileUrl} alt="Profile" className="img img-fluid" />
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
                    <div className="d-flex">
                      <ButtonComponent text="Edit" onClick={() => setEditMode(true)} />
                    <ButtonComponent text="LogOut" onClick={handleLogout} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>No user data available
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
