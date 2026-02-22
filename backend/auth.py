import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _safe_password(password: str) -> str:
    # Bcrypt has a strict 72-byte limit. 
    # To be 100% safe, we encode to bytes, truncate to 71, and decode back.
    # We use 71 to leave a safety buffer.
    encoded = password.encode('utf-8')
    return encoded[:71].decode('utf-8', 'ignore')

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(_safe_password(plain_password), hashed_password)

def get_password_hash(password):
    return pwd_context.hash(_safe_password(password))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
