import os, uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Path
from fastapi.middleware.cors import CORSMiddleware
from azure.cosmos import CosmosClient
from azure.storage.blob import BlobServiceClient
import tempfile
import shutil
from main.utils import extract_embedding, find_most_similar_face
from dotenv import load_dotenv
import hashlib
import jwt
from datetime import datetime, timedelta
import numpy as np

load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET")  # Keep this secret!
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60  # token valid for 60 minutes

# --- Azure Blob Storage Configuration ---
AZURE_STORAGE_ACCOUNT_NAME = os.environ.get("AZURE_STORAGE_ACCOUNT_NAME")
AZURE_BLOB_CONTAINER_NAME = os.environ.get("AZURE_BLOB_CONTAINER_NAME")
blob_key = os.environ.get("BLOB_KEY")
blob_conn_str = os.environ.get("BLOB_CONNECTION_STRING")

if not blob_key or not blob_conn_str:
     print("Warning: BLOB_KEY or BLOB_CONNECTION_STRING not set in environment variables.")


# --- Cosmos DB Setup ---
COSMOS_URL = os.environ.get("COSMOS_CONNECTION_STRING")
COSMOS_KEY = os.environ.get("COSMOS_KEY")

DB_NAME = "sensational"
CONTAINER_NAME = "container1" # User container
EVENT_CONTAINER = "events" # Event container

if not COSMOS_URL or not COSMOS_KEY:
     print("Warning: COSMOS_URL or COSMOS_KEY not set in environment variables.")

# Explicitly initialize containers to None at the module level
client = None
db = None
user_container = None
event_container = None

# Conditional initialization
if COSMOS_URL and COSMOS_KEY:
    try:
        client = CosmosClient.from_connection_string(COSMOS_URL, credential=COSMOS_KEY)
        db = client.get_database_client(DB_NAME)
        user_container = db.get_container_client(CONTAINER_NAME) # Get user container
        event_container = db.get_container_client(EVENT_CONTAINER) # Get event container
    except Exception as e:
        print(f"Error initializing Cosmos DB client: {e}")
        # Containers remain None if initialization fails


def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=JWT_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.now(datetime.now().astimezone().tzinfo) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

app = FastAPI()

# --- CORS Middleware Configuration ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add other origins if needed
    # Allow all origins for development purposes
    "*"  # Uncomment this line to allow all origins (not recommended for production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/login/")
async def login(email: str = Form(...), password: str = Form(...)):
    # Check if container is initialized
    if not user_container:
         raise HTTPException(status_code=500, detail="Database not initialized.")

    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    query = f"SELECT * FROM c WHERE c.email = '{email}' AND c.password = '{password_hash}'"
    try:
        items = list(user_container.query_items(query=query, enable_cross_partition_query=True))
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Failed to query user from DB: {str(e)}")


    if not items:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = items[0]
    token_data = {
        "userId": user["id"],
        "email": user["email"]
    }
    access_token = create_access_token(data=token_data)
    photo_url = f"https://{AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{AZURE_BLOB_CONTAINER_NAME}/{user['id']}.jpg"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "userId": user["id"],
            "fullName": user["fullName"],
            "email": user["email"],
            "photoUrl": photo_url,
            "embedding": user["embedding"]
        }
    }

@app.get("/")
async def root():
    return {"message": "Welcome to the Sensational Face Recognition API!"}

@app.post("/register/")
async def register_face(
    file: UploadFile = File(...),
    fullName: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
):
    # Check if containers are initialized
    if not user_container or not blob_conn_str:
         raise HTTPException(status_code=500, detail="Database or Blob Storage not initialized.")

    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    userId = str(uuid.uuid4())

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")

    try:
        blob_service_client = BlobServiceClient.from_connection_string(blob_conn_str)
        embedding = extract_embedding(tmp_path)
        blob_client = blob_service_client.get_blob_client(container=AZURE_BLOB_CONTAINER_NAME, blob=f"{userId}.jpg")
        with open(tmp_path, "rb") as data:
            blob_client.upload_blob(data)
        os.remove(tmp_path)
    except Exception as e:
        if os.path.exists(tmp_path):
             os.remove(tmp_path)
        error_detail = f"Failed during face processing or storage: {str(e)}"
        if "No face detected" in str(e):
             error_detail = "No face detected in the uploaded image. Please try another photo."
        raise HTTPException(status_code=500, detail=error_detail)

    doc = {
        "id": userId,
        "email": email,
        "fullName": fullName,
        "password": password_hash,
        "embedding": embedding.tolist(),
    }

    try:
        user_container.upsert_item(doc) # Use user_container
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register face in DB: {str(e)}")

    return {"message": "Account registered successfully!"}

# --- New Endpoint: GET event by ID ---
@app.get("/events/{eventId}")
async def get_event_by_id(eventId: str = Path(...)):
    # Check if containers are initialized
    if not event_container or not user_container:
         raise HTTPException(status_code=500, detail="Database not initialized.")

    # Query the event by ID
    query = f"SELECT * FROM c WHERE c.id = '{eventId}'"
    try:
        items = list(event_container.query_items(query=query, enable_cross_partition_query=True))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve event from DB: {str(e)}")

    if not items:
        raise HTTPException(status_code=404, detail="Event not found")

    event = items[0]

    # Optional: Fetch creator's full name and email
    creator_details = None
    if "userId" in event:
        creator_query = f"SELECT c.id, c.fullName, c.email FROM c WHERE c.id = '{event['userId']}'"
        try:
            creator_items = list(user_container.query_items(query=creator_query, enable_cross_partition_query=True))
            if creator_items:
                creator_details = creator_items[0]
        except Exception as e:
            print(f"Warning: Failed to fetch creator details for event {eventId}: {str(e)}")
            # Continue even if creator details can't be fetched

    # Add creator details to the event object if fetched
    if creator_details:
        event["creatorName"] = creator_details.get("fullName")
        event["creatorEmail"] = creator_details.get("email")


    # Fetch attendee details for this specific event
    attendee_details = []
    if user_container and "attendees" in event:
        for attendee_id in event["attendees"]:
            attendee_query = f"SELECT c.id, c.fullName, c.email FROM c WHERE c.id = '{attendee_id}'"
            try:
                attendee_items = list(user_container.query_items(query=attendee_query, enable_cross_partition_query=True))
                if attendee_items:
                    attendee_details.append(attendee_items[0])
            except Exception as e:
                print(f"Warning: Failed to fetch details for attendee {attendee_id} in event {eventId}: {str(e)}")

    event["attendeeDetails"] = attendee_details # Add attendee details

    return event # Return the single event object


@app.post("/recognize-face/")
async def recognize_face(file: UploadFile = File(...)):
    # Check if container is initialized
    if not user_container:
         raise HTTPException(status_code=500, detail="Database not initialized.")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")

    try:
        input_embedding = extract_embedding(tmp_path)
    except Exception as e:
        if os.path.exists(tmp_path):
             os.remove(tmp_path)
        error_detail = f"Failed to extract embedding: {str(e)}"
        if "No face detected" in str(e):
             error_detail = "No face detected in the uploaded image."
        raise HTTPException(status_code=400, detail=error_detail)


    try:
        stored_docs = list(user_container.read_all_items())
    except Exception as e:
        if os.path.exists(tmp_path):
             os.remove(tmp_path)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users from DB: {str(e)}")

    top_match = find_most_similar_face(input_embedding, stored_docs)

    os.remove(tmp_path)

    if top_match and top_match[1] > 0.8:
        matched_user = next((doc for doc in stored_docs if doc["id"] == top_match[0]), None)
        photo_url = f"https://{AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{AZURE_BLOB_CONTAINER_NAME}/{matched_user['id']}.jpg"


        return {
            "recognized": True,
            "user": {
                "userId": matched_user["id"],
                "fullName": matched_user["fullName"],
                "email": matched_user["email"],
                "photoUrl": photo_url,
                "embedding": matched_user["embedding"]
            },
            "similarity": round(top_match[1], 4)
        }
    else:
        # If no match or similarity is low
        return {
            "recognized": False,
            "user": None,
            "similarity": round(top_match[1], 4) if top_match else 0,
            "detail": "Face not recognized with sufficient similarity."
        }

@app.post("/events/")
async def create_event(eventName: str = Form(...), start_date: str = Form(...), end_date: str = Form(...), userId: str = Form(...)):
    # Check if container is initialized
    if not event_container:
         raise HTTPException(status_code=500, detail="Event database not initialized.")

    if not eventName or not start_date or not end_date:
        raise HTTPException(status_code=400, detail="Event name, start date, and end date are required")

    eventId = str(uuid.uuid4())
    event_doc = {
        "id": eventId,
        "userId": userId,
        "eventName": eventName,
        "start_date": start_date,
        "end_date": end_date,
        "attendees": []
    }

    try:
        event_container.upsert_item(event_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create event in DB: {str(e)}")

    return {"message": "Event created successfully!", "eventId": eventId}

@app.patch("/events-presensi/{eventId}")
async def update_event(eventId: str, file: UploadFile = File(...)):
    # Check if containers are initialized
    if not event_container or not user_container:
         raise HTTPException(status_code=500, detail="Database not initialized.")

    if not eventId:
        raise HTTPException(status_code=400, detail="Event ID is required")

    try:
        recognize_face_response = await recognize_face(file=file)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during face recognition for event attendance: {str(e)}")


    if not recognize_face_response.get("recognized"):
        error_detail = recognize_face_response.get("detail", "Face not recognized.")
        raise HTTPException(status_code=400, detail=error_detail)

    userId = recognize_face_response["user"]["userId"]
    fullName = recognize_face_response["user"]["fullName"]

    query = f"SELECT * FROM c WHERE c.id = '{eventId}'"
    try:
        items = list(event_container.query_items(query=query, enable_cross_partition_query=True))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve event from DB: {str(e)}")

    if not items:
        raise HTTPException(status_code=404, detail="Event not found")

    event = items[0]

    if userId in event.get("attendees", []):
        return {"message": f"Attendance already recorded for {fullName}."}

    if "attendees" not in event:
        event["attendees"] = []
    event["attendees"].append(userId)

    try:
        event_container.upsert_item(event)
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Failed to update event in DB: {str(e)}")

    return {"message": f"Attendance recorded successfully for {fullName}!",
            "fullName": fullName,
            "userId": userId
            }

@app.get("/events/")
async def get_events():
    # Check if containers are initialized
    if not event_container or not user_container:
         raise HTTPException(status_code=500, detail="Database not initialized.")

    query = "SELECT * FROM c"
    try:
        events_list = list(event_container.query_items(query=query, enable_cross_partition_query=True))
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Failed to retrieve events from DB: {str(e)}")

    if not events_list:
        raise HTTPException(status_code=404, detail="No events found")

    detailed_events = []
    for event in events_list:
        # Fetch creator details
        creator_details = None
        if "userId" in event:
             creator_query = f"SELECT c.id, c.fullName, c.email FROM c WHERE c.id = '{event['userId']}'"
             try:
                 creator_items = list(user_container.query_items(query=creator_query, enable_cross_partition_query=True))
                 if creator_items:
                     creator_details = creator_items[0]
             except Exception as e:
                 print(f"Warning: Failed to fetch creator details for event {event.get('id', 'N/A')}: {str(e)}")

        if creator_details:
             event["creatorName"] = creator_details.get("fullName")
             event["creatorEmail"] = creator_details.get("email")


        # Fetch attendee details
        attendee_details = []
        if user_container and "attendees" in event:
            for attendee_id in event["attendees"]:
                attendee_query = f"SELECT c.id, c.fullName, c.email FROM c WHERE c.id = '{attendee_id}'"
                try:
                    attendee_items = list(user_container.query_items(query=attendee_query, enable_cross_partition_query=True))
                    if attendee_items:
                        attendee_details.append(attendee_items[0])
                except Exception as e:
                    print(f"Warning: Failed to fetch details for attendee {attendee_id} in event {event.get('id', 'N/A')}: {str(e)}")

        event["attendeeDetails"] = attendee_details
        detailed_events.append(event)

    return {"events": detailed_events}


