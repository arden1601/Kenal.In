from pydantic import BaseModel
from fastapi import UploadFile

class LoginData(BaseModel):
    email: str
    password: str

class RegisterData(BaseModel):
    email: str
    password: str
    fullName: str
    uploadedFile: UploadFile
