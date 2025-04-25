import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Header from './Header';

const CamView = () => {
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState("Not Yet");
  const [imageData, setImageData] = useState(null);

  // Event details from the image
  const eventDetails = {
    name: "Event A",
    creator: "Cornelius Arden Satwika",
    email: "corneliusardenganteng@wik.com",
    start: "17/04/25 17:00:00",
    end: "17/04/25 20:00:00"
  };

  const startCamera = () => {
    setIsCameraActive(true);
    setImageData(null);
  };

  const takePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(imageSrc);
    setIsCameraActive(false);
    
    // Process the image with backend
    processImageWithBackend(imageSrc);
  }, [webcamRef]);

  const processImageWithBackend = async (imageData) => {
    setIsProcessing(true);
    
    try {
      // Simulate backend API call with a timeout
      // In a real application, you would make an actual API call here
      setTimeout(() => {
        // Simulating successful verification
        setPresenceStatus("Verified");
        setIsProcessing(false);
      }, 2000);

      // Example of actual API call (commented out)
      /*
      const response = await fetch('your-backend-api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      const result = await response.json();
      
      if (result.verified) {
        setPresenceStatus("Verified");
      } else {
        setPresenceStatus("Failed");
      }
      setIsProcessing(false);
      */

    } catch (error) {
      console.error("Error processing image:", error);
      setPresenceStatus("Failed");
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    // In a real app, this would navigate back
    setIsCameraActive(false);
    if (imageData) {
      setImageData(null);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Header page="Dashboard" />
      
      <div className="pt-24 px-4 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Event Details Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-80 flex-shrink-0">
          <div className="flex items-center mb-6">
            <button 
              onClick={goBack}
              className="flex items-center text-pink-500 hover:text-pink-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{eventDetails.name}</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Creator</p>
              <p className="font-medium">{eventDetails.creator}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{eventDetails.email}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Start</p>
              <p className="font-medium">{eventDetails.start}</p>
            </div>
            
            <div>
              <p className="text-gray-500">End</p>
              <p className="font-medium">{eventDetails.end}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Presence</p>
              <div className="flex items-center">
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-pink-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-medium text-gray-500">Processing...</p>
                  </div>
                ) : (
                  <>
                    <p className={`font-medium ${presenceStatus === "Verified" ? "text-green-500" : "text-red-500"}`}>
                      {presenceStatus}
                    </p>
                    {presenceStatus === "Not Yet" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {presenceStatus === "Verified" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Camera View */}
        <div className="flex-grow">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg aspect-video w-full flex items-center justify-center">
            {isCameraActive ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />
            ) : imageData ? (
              <img 
                src={imageData} 
                alt="Captured photo" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-300 text-lg mb-6">Camera preview will appear here</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Start Camera
                </button>
              </div>
            )}
          </div>
          
          {isCameraActive && (
            <div className="flex justify-center mt-6">
              <button
                onClick={takePhoto}
                className="px-8 py-4 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors flex items-center"
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
              </button>
            </div>
          )}
          
          {imageData && !isCameraActive && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isProcessing}
              >
                Retake Photo
              </button>
              {presenceStatus === "Verified" && (
                <button
                  onClick={goBack}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Finish
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CamView;