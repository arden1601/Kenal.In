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

client = CosmosClient.from_connection_string(COSMOS_URL, credential=COSMOS_KEY)
db = client.get_database_client(DB_NAME)
container = db.get_container_client(CONTAINER_NAME)

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
        "embedding": embedding.tolist()
    }

    # Insert into Cosmos DB
    container.upsert_item(doc)

    return {"message": "Face registered successfully!"}

@app.post("/recognize/")
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

    if top_match and top_match[1] > 0.8:
        return {
            "recognized": True,
            "userId": top_match[0],
            "similarity": round(top_match[1], 4)
        }
    else:
        return {
            "recognized": False,
            "similarity": round(top_match[1], 4) if top_match else 0
        }
