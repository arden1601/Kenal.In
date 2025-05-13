import { useState, useRef, useCallback, useEffect } from "react"; // Import useEffect
import Webcam from "react-webcam";
import Header from "../Header";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; // Import axios
import { apiRoute } from "../../../helper/api/route";
import toast from "react-hot-toast"; // Import toast
import { format } from "date-fns"; // Import format for date display

const CamView = () => {
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState("Not Yet"); // Can be "Not Yet", "Processing...", "Recognized", "Attended", "Not Recognized", "Error"
  const [imageData, setImageData] = useState(null);
  const [eventDetails, setEventDetails] = useState(null); // State to store fetched event details
  const [loadingEvent, setLoadingEvent] = useState(true); // Loading state for fetching event details
  const [eventError, setEventError] = useState(null); // Error state for fetching event details

  const navigate = useNavigate(); // Get the navigate function
  const { eventId } = useParams(); // Get eventId from URL parameters

  // Fetch event details when the component mounts or eventId changes
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setEventError("Event ID is missing.");
        setLoadingEvent(false);
        return;
      }

      setLoadingEvent(true);
      setEventDetails(null);
      setEventError(null);
      try {
        // Fetch event details using the eventId
        const response = await axios.get(apiRoute.events.getById(eventId)); // Assuming GET /events/{id} exists

        if (response.status === 200 && response.data) {
          setEventDetails(response.data);
        } else {
          setEventError("Failed to fetch event details.");
          toast.error("Failed to fetch event details.");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        const errorMessage =
          err.response?.data?.detail || "Failed to fetch event details.";
        setEventError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventDetails();
  }, [eventId]); // Re-run effect if eventId changes

  const startCamera = () => {
    setIsCameraActive(true);
    setImageData(null);
    setPresenceStatus("Not Yet"); // Reset status when starting camera
  };

  const takePhoto = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(imageSrc);
    setIsCameraActive(false);

    // Process the image with backend
    processImageWithBackend(imageSrc);
  }, [webcamRef]); // Add webcamRef to dependencies

  const processImageWithBackend = async (imageDataUrl) => {
    setIsProcessing(true);
    setPresenceStatus("Processing..."); // Update status

    if (!eventId) {
      setPresenceStatus("Error");
      toast.error("Event ID is missing. Cannot record attendance.");
      setIsProcessing(false);
      return;
    }

    // Convert base64 image data URL to a Blob or File
    // The data URL is in the format "data:image/jpeg;base64,..."
    const byteCharacters = atob(imageDataUrl.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" }); // Use the correct MIME type

    // Create FormData to send the file
    const formData = new FormData();
    // Append the blob as a file with the name 'file', matching backend parameter
    formData.append("file", blob, "webcam_photo.jpg"); // Provide a filename

    try {
      // --- Step 1: Recognize Face ---
      const recognizeResponse = await axios.post(
        apiRoute.face.recognize,
        formData
      );

      if (
        recognizeResponse.status === 200 &&
        recognizeResponse.data.recognized
      ) {
        console.log("Face recognized:", recognizeResponse.data.user);
        setPresenceStatus("Recognized");
        toast.success(`Recognized: ${recognizeResponse.data.user.fullName}`);

        // --- Step 2: Record Attendance (Presensi) ---
        // Use the same formData (containing the image file) for the presensi endpoint
        const presensiResponse = await axios.patch(
          apiRoute.events.presensi(eventId),
          formData
        ); // Use PATCH method

        if (presensiResponse.status === 200) {
          // Backend returns a message like "Attendance recorded successfully" or "User already registered"
          setPresenceStatus("Attended"); // Or a more specific status if backend provides it
          toast.success(
            presensiResponse.data.message || "Attendance recorded."
          );
        } else {
          // Handle non-200 status from presensi endpoint
          setPresenceStatus("Failed");
          const errorMessage =
            presensiResponse.data?.detail || "Failed to record attendance.";
          toast.error(errorMessage);
        }
      } else {
        // Handle case where face is not recognized or recognition failed
        setPresenceStatus("Not Recognized");
        const errorMessage =
          recognizeResponse.data?.detail ||
          "Face not recognized. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during recognition or attendance:", error);
      setPresenceStatus("Failed");
      const errorMessage =
        error.response?.data?.detail || "An error occurred during processing.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
    // No need to explicitly set camera/image state here,
    // as component will unmount/remount or state will reset on navigation
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  // Helper function to safely format dates for display
  const safeFormatDisplayDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      // Attempt to parse as ISO string or number (seconds/milliseconds)
      let date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        // If standard parsing fails, try parsing as a number (seconds/milliseconds)
        const numberValue = Number(dateValue);
        if (!isNaN(numberValue)) {
          // Assume seconds if less than year ~2001 in milliseconds
          date = new Date(
            numberValue < 1000000000000 ? numberValue * 1000 : numberValue
          );
        }
      }

      if (isNaN(date.getTime())) {
        console.warn(`Invalid date value received for display: ${dateValue}`);
        return "Invalid Date";
      }
      // Format for display (e.g., "Apr 25, 2017 5:00 PM")
      return format(date, "PPpp"); // Using PPpp format from date-fns
    } catch (e) {
      console.error("Error formatting date for display:", dateValue, e);
      return "Error Formatting Date";
    }
  };

  // Render loading state for event details
  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-[#573C27] text-lg">Loading event details...</p>
      </div>
    );
  }

  // Render error state for event details
  if (eventError) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {eventError}</p>
      </div>
    );
  }

  // Render message if eventDetails is null after loading (e.g., event not found)
  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header page="Dashboard" /> {/* Assuming Header is appropriate here */}
      <div className="pt-28 px-4 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Event Details Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-80 flex-shrink-0">
          <div className="flex items-center mb-6">
            <button
              onClick={goBack}
              className="flex cursor-pointer items-center text-pink-500 hover:text-pink-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Display fetched event details */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {eventDetails.eventName}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Creator</p>
              {/* Display creator name - assuming it's available in eventDetails or you fetch it */}
              <p className="font-medium">{eventDetails.creatorName || "N/A"}</p>{" "}
              {/* Assuming a 'creatorName' field */}
            </div>

            <div>
              <p className="text-gray-500">Start</p>
              {/* Format and display start date */}
              <p className="font-medium">
                {safeFormatDisplayDate(eventDetails.start_date)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">End</p>
              {/* Format and display end date */}
              <p className="font-medium">
                {safeFormatDisplayDate(eventDetails.end_date)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Presence Status</p>{" "}
              {/* Changed label */}
              <div className="flex items-center">
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-pink-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-medium text-gray-500">Processing...</p>
                  </div>
                ) : (
                  <>
                    <p
                      className={`font-medium ${
                        presenceStatus === "Attended" // Check for "Attended" status
                          ? "text-green-500"
                          : presenceStatus === "Not Recognized" ||
                            presenceStatus === "Failed"
                          ? "text-red-500"
                          : "text-gray-500" // Default color for "Not Yet"
                      }`}>
                      {presenceStatus}
                    </p>
                    {/* Display icons based on status */}
                    {presenceStatus === "Not Yet" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 text-gray-500" // Changed color
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" // Changed icon to a circle with an X
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {presenceStatus === "Attended" && ( // Check for "Attended" status
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" // Changed icon to a circle with a checkmark
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {/* Add icon for Not Recognized/Failed status */}
                    {(presenceStatus === "Not Recognized" ||
                      presenceStatus === "Failed") && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-300 text-lg mb-6">
                  Camera preview will appear here
                </p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
                  disabled={loadingEvent || eventError || !eventDetails} // Disable if event not loaded
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
                disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Take Photo
                  </>
                )}
              </button>
            </div>
          )}

          {imageData && !isCameraActive && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isProcessing}>
                Retake Photo
              </button>
              {/* Show Finish button only if presence was successfully recorded */}
              {presenceStatus === "Attended" && (
                <button
                  onClick={goBack}
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                  Finish
                </button>
              )}
              {/* Show Try Again button if presence failed or not recognized */}
              {(presenceStatus === "Not Recognized" ||
                presenceStatus === "Failed") && (
                <button
                  onClick={startCamera} // Go back to camera to try again
                  className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors">
                  Try Again
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
