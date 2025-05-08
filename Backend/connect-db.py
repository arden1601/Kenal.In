import os
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient
from dotenv import load_dotenv

load_dotenv()

blob_key = os.environ.get("BLOB_KEY")
blob_conn_str = os.environ.get("BLOB_CONNECTION_STRING")

blob_client = BlobServiceClient.from_connection_string(blob_conn_str)

try:
    print("Azure Blob Storage Python quickstart sample")
    print("\nListing blobs...")

# List the blobs in the container
    blob_list = blob_client.list_containers()                       
    for blob in blob_list:
        print("\t" + blob.name)

    # Quickstart code goes here
    blob_client = blob_client.get_blob_client(container="face", blob="README.md")
    print("\nUploading to blob storage...")
    with open("./README.md", "rb") as data:
        blob_client.upload_blob(data)

except Exception as ex:
    print('Exception:')
    print(ex)