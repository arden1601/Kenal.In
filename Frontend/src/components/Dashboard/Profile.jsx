import { useState, useEffect } from "react";
import { useUser } from "../../helper/context/UserContext";
import ProfilePicturePlaceholder from "../../assets/ProfilePicturePlaceholder.png";
import HiPencilAlt from "../../assets/HiPencilAlt.png";

const Profile = () => {
  // Access user data and authentication state from the UserContext
  const { user, loading, error, logout } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  // Initialize local state with user data from context, or default values
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || ""); // Email is likely not editable, but we'll display it
  const [image, setImage] = useState(
    user?.photoUrl || ProfilePicturePlaceholder
  ); // Use photoUrl from context

  // Update local state when user data in context changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setImage(user.photoUrl || ProfilePicturePlaceholder);
    } else {
      // Clear state if user logs out
      setName("");
      setEmail("");
      setImage(ProfilePicturePlaceholder);
    }
  }, [user]); // Depend on the user object from context

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Display preview immediately
      setImage(URL.createObjectURL(file));
      // You would typically also store the actual file object if you were
      // going to upload it later on save.
      // setProfileFile(file); // Example: store the file to upload later
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleSave = () => {
    setIsEditing(false);
    // TODO: Add logic here to send updated name and potentially the new profile picture file
    // to your backend API.
    // You would likely need to use the user.userId and token from the context
    // to authenticate this request.
    console.log("Saving changes:", { name, email, image });
    // Example: Call an API to update profile
    // try {
    //   const formData = new FormData();
    //   formData.append('fullName', name);
    //   if (profileFile) { // Assuming you stored the file in state
    //     formData.append('file', profileFile);
    //   }
    //   await axios.patch(`${apiRoute.users}/${user.userId}`, formData, {
    //      headers: { Authorization: `Bearer ${token}` }
    //   });
    //   toast.success("Profile updated successfully!");
    //   // If backend returns updated user data, update the context user state
    //   // updateUserInContext(updatedUserData); // You would add this function to your context
    // } catch (err) {
    //   toast.error("Failed to update profile.");
    //   console.error("Profile update error:", err);
    // }
  };

  // Optional: Show a loading indicator or message if user data is still being fetched
  if (loading) {
    return <div className="text-center text-[#573C27]">Loading profile...</div>;
  }

  // Optional: Show an error message if fetching user data failed (less likely with current context setup)
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading profile: {error}
      </div>
    );
  }

  // Optional: Redirect or show a message if the user is not logged in
  if (!user) {
    // This component should ideally be protected by routing, but this is a fallback
    return (
      <div className="text-center text-red-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="relative bg-white w-full md:w-96 h-auto md:h-full rounded-xl shadow-lg p-6 mb-6 md:mb-0">
      <div className="flex flex-col items-center gap-y-4">
        <h2 className="text-xl font-semibold text-[#573C27]">Profile</h2>

        {/* PROFILE PICTURE */}
        <div className="relative w-48 h-48 md:size-72 mb-4">
          <img
            // Use the image state, which is initialized from user.photoUrl
            src={image}
            alt="Profile"
            className="w-full h-full rounded-xl object-cover"
          />
          {isEditing && (
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 bg-[#C95588] rounded-md p-1 cursor-pointer">
              <img src={HiPencilAlt} alt="Edit Icon" className="size-8" />
              <input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*" // Specify accepted file types
              />
            </label>
          )}
        </div>

        <div className="gap-y-1 flex w-full min-w-0 md:min-w-64 flex-col items-center">
          {/* NAMA (Full Name) */}
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2 text-[#573C27] text-center w-full px-3 py-2 border rounded-sm border-[#573C27]"
                placeholder="Type your name here"
              />
              <p className="-mt-2 text-slate-500 italic text-sm text-center">
                change your name or face image above
              </p>
            </>
          ) : (
            <h2 className="text-base text-[#573C27] font-semibold text-center break-words">
              {/* Display full name from state, initialized from context */}
              {name ? (
                name
              ) : (
                <span className="text-red-500 italic text-base">
                  Please add your name
                </span>
              )}
            </h2>
          )}
          {/* EMAIL */}
          {/* Display email from state, initialized from context */}
          {isEditing ? null : (
            <p className="text-[#573C27] text-base text-center break-words">
              {email}
            </p>
          )}
        </div>
      </div>

      {/* BUTTON */}
      {/* <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className="absolute inset-x-0 font-bold bottom-6 md:bottom-10 px-4 py-2 mx-8 bg-[#C95588] text-white rounded hover:brightness-[0.95] cursor-pointer transition-all duration-300">
        {isEditing ? "Save" : "Edit"}
      </button> */}
      <button
        onClick={logout}
        className="absolute inset-x-0 font-bold bottom-6 md:bottom-10 px-4 py-2 mx-8 bg-[#C95588] text-white rounded hover:brightness-[0.95] cursor-pointer transition-all duration-300">
        Logout
      </button>
    </div>
  );
};

export default Profile;
