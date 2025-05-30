# Backend/Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.10.13

# Set the working directory in the container
WORKDIR /app

# Install system dependencies that might be required for opencv-python (a deepface dependency)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/
COPY ./constraints.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt -c constraints.txt

# Copy the rest of the application's code into the container
COPY ./main /app/main

# Run the preload script to download and cache the DeepFace models
RUN python main/preload.py

# Expose port 8000 for the FastAPI application
EXPOSE 8000

# Run the Uvicorn server when the container launches
CMD ["uvicorn", "main.server:app", "--host", "0.0.0.0", "--port", "8000"]