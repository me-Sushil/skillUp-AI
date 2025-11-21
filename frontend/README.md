📘 SkillUp-AI — AI-Powered Learning Assistant

SkillUp-AI is an interactive learning platform that helps users master programming by chatting with an AI tutor, generating quizzes, and receiving personalized guidance based on their chosen programming language.

This project was built as part of the TEJ Fellowship (2025) and follows modern full-stack standards using React, Node.js, Express, MongoDB, and Gemini API.

🚀 Features
🧠 AI Learning Assistant

Users can chat with an AI tutor in real time.
Explanations, debugging help, and programming guidance.

📚 Select Preferred Programming Language
Users choose their desired programming language (JavaScript, Python, C++, etc.)
AI responses adapt to the selected language.

📝 Auto-Generated Quizzes
Generate multiple-choice questions based on conversation context.
Helps reinforce learning.

👤 User Authentication
Login / Signup
JWT-based authentication
Secure password hashing

📊 User Progress Tracking
Stores user history and quiz data
Personalized recommendations (future scope)

🛠️ Tech Stack
### Frontend

- **React.js** (v18+) - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Styling
- **React Context API** - State management

### Backend

- **Node.js** (v16+) - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Bcrypt.js** - Password hashing
- **Gemini API** 


🏗️ System Architecture
Frontend (React)
       ↓  Axios
Backend (Node + Express)
       ↓
MongoDB (Database)
       ↓
Gemini API (AI Responses + Quiz Generation)



⚙️ Installation & Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm package manager
- Git

📌 1. Clone the Repository
git clone https://github.com/me-Sushil/SkillUp-AI.git
cd SkillUp-AI

📌 2. Install dependencies:

📌  Setup Frontend
Go to the frontend folder:
cd frontend
npm install

📌  Setup Backend
Go to the backend folder:
cd frontend
npm install


✅ Create .env file

1. Create a .env file inside frontend folder:

VITE_LOGIN_URL="http://localhost:3001/api/auth/login"
VITE_REGISTER_URL="http://localhost:3001/api/auth/register"
VITE_VALIDATE_TOKEN_URL="http://localhost:3001/api/auth/validate-token"
VITE_AI_URL="http://localhost:3001/api/chat/chats"
VITE_USER_CHATS="http://localhost:3001/api/user/chats"
VITE_USER_QUIZE="http://localhost:3001/api/user/quiz"


Frontend runs on:
http://localhost:5173

Start frontend:
npm run dev

2. Create a .env file inside backend folder:

MONGODB_URL=Your Mongodb URL , like ("mongodb+srv://skillup-ai:skillup-ai@cluster0.4hhfkup.mongodb.net/skillUp-AI?retryWrites=true&w=majority&skillUpAI=Cluster0")
PORT=3001
JWT_SECRET="!2djS%$@LJLrd13*6%^&*nmNBdnGHFGD!@#7VcxcsWERTyu65#$%vcdfWER"
GEMINI_API_KEY=Gemini API key , Like ("AIzaSyBVKEdOgEIx1RMMpnW-3Qu3yQxewCuEYcY")


Backend runs on:
http://localhost:3001

Start backend:
npm run dev


🧩 Common Errors & Solutions
❌ MongoDB connection failed
✔ Check your MONGO_URI
✔ Ensure IP access is allowed in MongoDB Atlas


❌ OpenAI API not responding
✔ Check your GEMINI_API_KEY
✔ Ensure billing is active

CONNECT WITH ME :
LinkedIn : https://www.linkedin.com/in/me-sushil/


