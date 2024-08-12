from pymongo import MongoClient
import gridfs #PyMongo
import os

# Path to the image you want to store
image_path = 'image.png'

# Connect to the MongoDB database
client = MongoClient('mongodb://rumoaoime-database:27017/')
db = client['database_rumoaoime']  # Replace with your database name

fs = gridfs.GridFS(db, collection='images')  # Use or create a GridFS store in the database

# Function to store an image in MongoDB using GridFS
def store_image(image_path):
    with open(image_path, 'rb') as image_file:
        # The image's name is used as the identifier here. You could also use a unique identifier.
        image_name = os.path.basename(image_path)
        
        # Check if the file already exists and delete it if it does
        if fs.exists({"filename": image_name}):
            print(f"Image '{image_name}' already exists in the database. Deleting old one.")
            fs.delete(fs.find_one({"filename": image_name})._id)
        
        # Store the image in GridFS
        image_id = fs.put(image_file, filename=image_name)
        print(f"Stored '{image_name}' with ID: {image_id}")

# Store the image
store_image(image_path)
