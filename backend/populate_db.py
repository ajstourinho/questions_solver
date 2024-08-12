from pymongo import MongoClient

def populate_db():
    # Connect to MongoDB
    client = MongoClient('mongodb://my-database:27017/')
    db = client['my_database']  # Replace with your database name
    collection = db['provas_anteriores']  # Replace with your collection name

    # Data to insert - this can be modified to insert the data you need
    data = [
        {"name": "John Doe", "email": "johndoe@example.com"},
        {"name": "Jane Doe", "email": "janedoe@example.com"},
        # Add more documents as needed
    ]

    # Insert data into the collection
    try:
        result = collection.insert_many(data)
        print(f"Inserted {len(result.inserted_ids)} documents.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    populate_db()
