import os
import motor.motor_asyncio
from dotenv import load_dotenv
import logging

load_dotenv()

# Get the URI and clean it thoroughly
MONGO_URI = os.getenv("MONGO_URI", "").strip()

# Remove surrounding quotes if they exist (common copy-paste issue on Render)
if (MONGO_URI.startswith('"') and MONGO_URI.endswith('"')) or \
   (MONGO_URI.startswith("'") and MONGO_URI.endswith("'")):
    MONGO_URI = MONGO_URI[1:-1].strip()

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.vakyaai_db
# Collection names
analyses_collection = db.get_collection("analyses")
users_collection = db.get_collection("users")

async def check_database_connection():
    try:
        # Send a ping to confirm a successful connection
        await client.admin.command('ping')
        logging.info("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"MongoDB Not Connected: {e}")
        raise e
