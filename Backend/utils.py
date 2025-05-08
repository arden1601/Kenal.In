import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace

def extract_embedding(img_path: str):
    embedding_result = DeepFace.represent(img_path=img_path, model_name="facenet512", detector_backend="mtcnn")
    return np.array(embedding_result[0]["embedding"])

def find_most_similar_face(input_embedding, stored_embeddings):
    input_vec = input_embedding.reshape(1, -1)
    scores = []

    for doc in stored_embeddings:
        stored_vec = np.array(doc['embedding']).reshape(1, -1)
        score = cosine_similarity(input_vec, stored_vec)[0][0]
        scores.append((doc['userId'], score))

    if scores:
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[0]
    return None
