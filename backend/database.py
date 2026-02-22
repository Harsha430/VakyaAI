import os
import motor.motor_asyncio
from dotenv import load_dotenv
import logging

load_dotenv()

# Get the URI and clean it thoroughly
RAW_URI = os.getenv("MONGO_URI", "").strip()

def clean_uri(uri: str) -> str:
    if not uri:
        return ""
    # Remove any common prefixes
    if uri.lower().startswith("mongo_uri="):
        uri = uri[len("mongo_uri="):]
    
    uri = uri.strip()
    
    # Remove surrounding quotes recursively
    while (uri.startswith('"') and uri.endswith('"')) or \
          (uri.startswith("'") and uri.endswith("'")):
        uri = uri[1:-1].strip()
    
    # Handle the query string specifically for "key=value pairs" errors
    if '?' in uri:
        base, query = uri.split('?', 1)
        # Split by & and keep only parts that have a valid key=value structure
        parts = [p.strip() for p in query.split('&') if '=' in p]
        if parts:
            uri = f"{base.strip()}?{'&'.join(parts)}"
        else:
            uri = base.strip() # Drop the '?' if no valid options
            
    # Final check for trailing slashes or junk
    uri = uri.rstrip('/')
    
    return uri

MONGO_URI = clean_uri(RAW_URI)

# Masked logging for debugging on Render
if MONGO_URI:
    masked = f"{MONGO_URI[:15]}...{MONGO_URI[-5:]}" if len(MONGO_URI) > 20 else "***"
    logging.info(f"Connecting to MongoDB with URI: {masked}")

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
