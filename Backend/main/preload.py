# main/preload.py
import os

# Set the environment variable to avoid TensorFlow warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

try:
    from deepface import DeepFace
    print("Pre-loading and building DeepFace models...")
    # This will download and cache the models, warming up the application.
    DeepFace.build_model("Facenet512")
    DeepFace.build_model("fastmtcnn")
    print("DeepFace models pre-loaded and built successfully.")
except Exception as e:
    print(f"An error occurred during model pre-loading: {e}")