# VākyaAI 🪶

**Refine Your Words. Command Your Vision.**

VākyaAI is an intelligent, AI-powered pitch refinement system designed to evaluate and enhance technical project pitches. Unlike generic chatbots, VākyaAI functions as a structured evaluation engine, analyzing pitches for clarity, impact, innovation, and technical depth using a strict scoring rubric.

![VākyaAI Theme](https://via.placeholder.com/800x400?text=VakyaAI+Digital+Manuscript+Theme)

## 🚀 Key Features

-   **AI-Powered Analysis**: Utilizes Google Gemini 1.5 Flash to provide deep, structured feedback.
-   **Strict Scoring Engine**: Evaluates pitches on 8 specific metrics (Clarity, Innovation, Persuasiveness, etc.) with a 0-10 scale.
-   **"Digital Manuscript" Aesthetic**: A unique, premium UI theme inspired by ancient scripts and modern intellect.
-   **Visual Analytics**: Interactive radar charts to visualize pitch strengths and weaknesses.
-   **Instant Refinement**: Generates a professionally rewritten version of your pitch automatically.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts
-   **Backend**: FastAPI, Python, Motor (Async MongoDB)
-   **AI Engine**: Google Gemini 1.5 Flash
-   **Database**: MongoDB Atlas

## 📦 Installation & Setup

### Prerequisites
-   Node.js & npm
-   Python 3.9+
-   MongoDB Connection URI
-   Google Cloud API Key (Gemini)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Configure Environment
# Create a .env file in /backend and add:
# GEMINI_API_KEY=your_key_here
# MONGO_URI=your_mongo_uri_here

# Run Server
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🛡️ Security & Architecture

-   **Strict JSON Validation**: The backend enforces rigid JSON structure from the AI to prevent frontend crashes.
-   **Timeout Protection**: API calls have safeguards to ensure the system remains responsive.
-   **CORS Configured**: Secure communication between frontend and backend.

## 📄 License

MIT
