import os, uuid
from fastapi import FastAPI, File, UploadFile, HTTPException
from azure.cosmos import CosmosClient
from azure.storage.blob import BlobServiceClient
import tempfile
import shutil
from utils import extract_embedding, find_most_similar_face
from dotenv import load_dotenv
import hashlib
import jwt
from datetime import datetime, timedelta
import numpy as np

load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET")  # Keep this secret!
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60  # token valid for 60 minutes

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=JWT_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.now().astimezone() + expires_delta  # Corrected the usage of astimezone()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

app = FastAPI()

# Cosmos DB setup
COSMOS_URL = os.environ.get("COSMOS_CONNECTION_STRING")
COSMOS_KEY = os.environ.get("COSMOS_KEY")

DB_NAME = "sensational"
CONTAINER_NAME = "container1"
EVENT_CONTAINER = "events"

client = CosmosClient.from_connection_string(COSMOS_URL, credential=COSMOS_KEY)
db = client.get_database_client(DB_NAME)
container = db.get_container_client(CONTAINER_NAME)
event_container = db.get_container_client(EVENT_CONTAINER)

blob_key = os.environ.get("BLOB_KEY")
blob_conn_str = os.environ.get("BLOB_CONNECTION_STRING")


@app.post("/login/")
async def login(email: str = "", password: str = ""):
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Hash the password
    password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Query Cosmos DB
    query = f"SELECT * FROM c WHERE c.email = '{email}' AND c.password = '{password_hash}'"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))

    if not items:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = items[0]
    token_data = {
        "userId": user["id"],
        "email": user["email"]
    }
    access_token = create_access_token(data=token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "userId": user["id"],
            "fullName": user["fullName"],
            "embedding": user["embedding"]
        }
    }
@app.get("/")
async def root():
    return {"message": "Welcome to the Sensational Face Recognition API!"}

@app.post("/register/")
async def register_face(file: UploadFile = File(...), fullName: str = "", email: str = "", password: str = "",):
    # Make the password hash
    password = password.encode('utf-8')
    password = hashlib.sha256(password).hexdigest()
    userId = str(uuid.uuid4())
    # Save uploaded file to temp
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Extract embedding
    try:
        blob_client = BlobServiceClient.from_connection_string(blob_conn_str)
        embedding = extract_embedding(tmp_path)
        blob_client = blob_client.get_blob_client(container="face", blob=f"{userId}.jpg")
        with open(tmp_path, "rb") as data:
            blob_client.upload_blob(data)
        os.remove(tmp_path)  # Clean up temp file
    except Exception as e:
        raise ValueError({"error": f"Failed to extract embedding: {str(e)}"}) 

    # Create document
    doc = {
        "id": userId,
        "email": email,
        "fullName": fullName,
        "password": password,
        "embedding": embedding.tolist(),  # Convert numpy array to list
    }

    # Insert into Cosmos DB
    try:
        container.upsert_item(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register face: {str(e)}")

    return {"message": "Account registered successfully!"}

@app.post("/recognize-face/")
async def recognize_face(file: UploadFile = File(...)):
    # Save uploaded file to temp
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Extract embedding
    try:
        input_embedding = extract_embedding(tmp_path)
    except Exception as e:
        return {"error": f"Failed to extract embedding: {str(e)}"}

    # Load embeddings from Cosmos DB
    stored_docs = list(container.read_all_items())

    # Find most similar face
    top_match = find_most_similar_face(input_embedding, stored_docs)

    os.remove(tmp_path)  # Clean up temp file
    if top_match and top_match[1] > 0.8:
        return {
            "recognized": True,
            "id": top_match[0],
            "fullName": next((doc["fullName"] for doc in stored_docs if doc["id"] == top_match[0]), None),
            "similarity": round(top_match[1], 4)
        }
    else:
        return {
            "recognized": False,
            "similarity": round(top_match[1], 4) if top_match else 0
        }

@app.post("/events/")
async def create_event(eventName: str = "", start_date: str = "", end_date: str = "", userId: str = ""):
    if not eventName or not start_date or not end_date:
        raise HTTPException(status_code=400, detail="Event name, start date, and end date are required")

    # Create event document
    eventId = str(uuid.uuid4())
    event_doc = {
        "id": eventId,
        "userId": userId,
        "eventName": eventName,
        "start_date": start_date,
        "end_date": end_date,
        "attendees": []
    }

    # Insert into Cosmos DB
    event_container.upsert_item(event_doc)

    return {"message": "Event created successfully!", "eventId": eventId}

@app.patch("/events-presensi/{eventId}")
async def update_event(eventId: str, file: UploadFile = File(...)):
    # Check if eventId is provided
    if not eventId:
        raise HTTPException(status_code=400, detail="Event ID is required")
    
    recognize_face_response = await recognize_face(file=file)
    if not recognize_face_response["recognized"]:
        raise HTTPException(status_code=400, detail="Face not recognized")
    userId = recognize_face_response["id"]

    # Query the event by ID
    query = f"SELECT * FROM c WHERE c.id = '{eventId}'"
    items = list(event_container.query_items(query=query, enable_cross_partition_query=True))

    if not items:
        raise HTTPException(status_code=404, detail="Event not found")

    event = items[0]
       # Check if userId is already in the attendees list
    if userId in event.get("attendees", []):
        raise HTTPException(status_code=400, detail="User already registered for this event")
    
    # Append the userId to the attendees list
    if "attendees" not in event:
        event["attendees"] = []
    event["attendees"].append(userId)
    event_container.upsert_item(event)

    return {"message": "Event updated successfully!",
            "fullName": recognize_face_response["fullName"],
            }

@app.get("/events/")
async def get_events():
    # Query all events
    query = "SELECT * FROM c"
    items = list(event_container.query_items(query=query, enable_cross_partition_query=True))

    if not items:
        raise HTTPException(status_code=404, detail="No events found")

    return {"events": items}

# @app.post("/recognize/")
# async def recognize_face_single(file: UploadFile = File(...), embedding: list[float] = None ):
#     # embedding = dict(embedding)
#     # if embedding is None or "user" not in embedding or "embedding" not in embedding["user"]:
#         # return {"error": "Embedding object is required and must contain 'user' with 'embedding'."}
#     # Extract user embedding from the object
#     user_embedding = np.array(embedding, dtype=float)
    
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name
#     # Extract embedding
#     try:
#         input_embedding = extract_embedding(tmp_path)
#     except Exception as e:
#         return {"error": f"Failed to extract embedding: {str(e)}"}
#     top_match = compare_embeddings(input_embedding, user_embedding)

#      # Clean up temp file
#     if top_match and top_match[1] > 0.8:
#         return {
#             "recognized": True,
#             "id": top_match[0],
#             "similarity": round(top_match[1], 4)
#         }
#     else:
#         return {
#             "recognized": False,
#             "similarity": round(top_match[1], 4) if top_match else 0
#         }