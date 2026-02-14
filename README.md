# VākyaAI 🪶
**Refine Your Words. Command Your Vision.**

VākyaAI is a premium, AI-powered pitch refinement ecosystem. It doesn't just "fix" grammar; it functions as a structured evaluation engine and pitch architect, leveraging the power of **Gemini 2.5 Flash** to provide elite-level feedback for technical founders, developers, and students.

![VākyaAI Premium Theme](https://via.placeholder.com/1000x500?text=VakyaAI+Manuscript+Edition)

---

## ✨ Evolutionary Features

### 🎙️ Multi-Modal Input
- **Voice-to-Manuscript**: Direct pitch dictation using the Web Speech API.
- **Template Library**: Pre-built elite structures for Elevator Pitches, YC Applications, and Technical deep-dives.

### 🏛️ History Archives
- **Manuscript Repository**: Every analysis is permanently recorded and accessible.
- **High-Fidelity Scroll Recovery**: Re-view full analysis reports, radar charts, and suggestions in a high-end modal experience.

### 🪴 Growth Lab (Agentic Learning)
- **Personalized Skill Roadmap**: AI-generated actionable steps based on your lowest metric scores.
- **Enlightened Resources**: Curated YouTube tutorials, blogs, and documentation links tailored to your specific pitch content.
- **Practice Mode**: Facing the "Digital Judges" with AI-generated adversarial questions to test your defense.

### 🎯 Deep Analytics
- **8-Point Scrutiny**: Clarity, Problem Definition, Solution Explanation, Technical Depth, Innovation, Impact, Logical Flow, and Persuasiveness.
- **Improvement Metrics**: Real-time delta calculation showing exactly how much better your refined pitch is.

---

## 🛡️ Technical Architecture & Robustness

### 🧠 Bulletproof JSON Architecture
We've implemented a self-healing diagnostic pipeline to ensure 100% uptime:
- **`json-repair` Integration**: The backend automatically "heals" malformed AI strings (fixing missing brackets or unescaped quotes).
- **Constrained Decoding**: Leveraging Gemini's `application/json` MIME type for structured data enforcement.
- **Defensive Multi-Layer Extraction**: A custom regex-based pipeline that surgically extracts JSON from even the largest AI responses.

### 🎨 Design Aesthetic
- **Glassmorphism UI**: A fluid, translucent interface with subtle glows and parchment-inspired hues.
- **Cinematic Motion**: Powered by `Framer Motion` for organic transitions and interactive elements.
- **Visual Intelligence**: `Recharts` implementation for radar-based performance visualization.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: FastAPI (Python), Motor (Async MongoDB), Pydantic.
- **Intelligence**: Google Gemini 2.5 Flash.
- **Database**: MongoDB Atlas.

---

## 📦 Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate & Install
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Configure .env
GEMINI_API_KEY=your_key
MONGO_URI=your_mongodb_uri
PORT=8000

# Run
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📜 License
MIT © 2026 VākyaAI Team.
