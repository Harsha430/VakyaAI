import os
import motor.motor_asyncio
from dotenv import load_dotenv
import logging

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in .env file")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.vakyaai_db
analyses_collection = db.analyses

async def check_database_connection():
    try:
        # Send a ping to confirm a successful connection
        await client.admin.command('ping')
        logging.info("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        logging.error(f"MongoDB Not Connected: {e}")
        raise e
