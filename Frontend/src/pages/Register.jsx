import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import logoWeb from '../assets/LOGO FREAKY AHH.png';
import { apiRoute } from '../helper/api/route';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Color palette from the provided image
  const colors = {
    darkBrown: '#573C27',
    tan: '#A98360',
    cream: '#FDEED9',
    lightPink: '#FFADC6',
    purple: '#E34989'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formToSend = new FormData();
    formToSend.append('email', email);
    formToSend.append('password', password);
    formToSend.append('fullName', fullName);
    if (profilePhoto) {
      formToSend.append('uploadedFile', profilePhoto);
    }

    const registerFunction = axios.post(apiRoute.auth.register, formToSend);
    console.log(profilePhoto)
    toast.promise(registerFunction, {
      loading: 'Registering...',
      success: (res) => {
        if (res.status === 200) {
          console.log('Registration successful:', res.data);
          return 'Registration successful!';
        } else {
          return 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        return 'Registration failed. Please try again.';
      },
    });

    console.log('Registration attempt with:', { email, password, confirmPassword, fullName, profilePhoto });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setCameraActive(false);
    }
  };

  const openCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraActive(false);
      alert("Could not access camera. Please check your permissions.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], "profile-photo.png", { type: "image/png" });
        setProfilePhoto(file);
        setPhotoPreview(canvas.toDataURL("image/png"));
        
        // Stop camera stream
        const stream = video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
        setCameraActive(false);
      }, "image/png");
    }
  };

  const closeCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setCameraActive(false);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <img src={logoWeb} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
            <h1 className="text-2xl font-bold" style={{ color: colors.darkBrown }}>
              Kenal.<span style={{ color: colors.purple }}>In</span>
            </h1>
          </div>
          <h2 className="text-xl font-medium" style={{ color: colors.darkBrown }}>Sign in</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none"
                style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.tan }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none"
                style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.tan }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Profile Photo
            </label>
            <div className="mt-2 flex flex-col items-center">
              {photoPreview ? (
                <div className="mb-4 relative">
                  <img 
                    src={photoPreview} 
                    alt="Profile Preview" 
                    className="w-32 h-32 rounded-full object-cover border-2"
                    style={{ borderColor: colors.purple }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: colors.tan, color: 'white' }}
                >
                  <Camera size={48} />
                </div>
              )}
              
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 rounded-md text-white font-medium text-sm"
                  style={{ backgroundColor: colors.tan }}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={openCamera}
                  className="px-4 py-2 rounded-md text-white font-medium text-sm"
                  style={{ backgroundColor: colors.tan }}
                >
                  Take Photo
                </button>
              </div>
            </div>
          </div>

          {/* Camera Interface */}
          {cameraActive && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-md w-full">
                <div className="text-lg font-bold mb-2" style={{ color: colors.darkBrown }}>Take your profile photo</div>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover bg-black rounded-md"
                  ></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={closeCamera}
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: colors.tan }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: colors.purple }}
                  >
                    Take Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white font-medium transition-colors mt-6"
            style={{ backgroundColor: colors.purple }}
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center" style={{ color: colors.darkBrown }}>
          Already have an account?{' '}
          <Link to="/login" className="hover:underline" style={{ color: colors.purple }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;