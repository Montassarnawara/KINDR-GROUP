# 🌟 KINDR - Kindness Through AI

> Transforming online communication by detecting harmful content and suggesting respectful alternatives using AI.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

**KINDR** is an innovative platform that promotes respectful online communication by:
- **Detecting** toxic and harmful content in real-time
- **Rewriting** offensive messages into respectful alternatives using AI
- **Educating** users through gamification and community features
- **Protecting** online spaces with a browser extension and web platform

The project consists of three main components:
1. **Backend API** - FastAPI server with AI-powered toxicity detection and text rewriting
2. **Browser Extension** - Chrome extension that monitors and improves online comments
3. **Web Platform (VibeShield)** - React-based dashboard with analytics, missions, and community features

## ✨ Features

### 🤖 AI-Powered Content Moderation
- Real-time toxicity detection using Detoxify ML model
- Intelligent text rewriting with Groq LLM (Llama models)
- Configurable sensitivity thresholds

### 🔌 Browser Extension
- Automatic detection of harmful comments on any website
- One-click respectful rewrites
- Non-intrusive UI overlay
- Works across all major platforms

### 📊 Web Dashboard
- **Analytics**: Track your communication improvement over time
- **Missions**: Gamified challenges to practice respectful communication
- **Leaderboard**: Community rankings and achievements
- **Journey**: Personal growth tracking
- **Community**: Connect with others committed to kindness
- **Profile & Settings**: Customize your experience

### 🎮 Gamification
- Complete missions for rewards
- Earn badges and achievements
- Climb the leaderboard
- Track your "kindness score"

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Browser Ext.   │────▶│   FastAPI API    │◀────│   Web App       │
│  (Content.js)   │     │   (app.py)       │     │  (React/Vite)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ├─▶ Detoxify Model (Toxicity Detection)
                               └─▶ Groq LLM (Text Rewriting)
```

## 🚀 Installation

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 18+ and npm/bun
- **Groq API Key** ([Get one here](https://console.groq.com/))

### 1️⃣ Backend Setup

```bash
# Navigate to project root
cd projet

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn groq python-dotenv detoxify

# Create .env file
echo GROQ_API_KEY=your_groq_api_key_here > .env

# Run the server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 2️⃣ Web App Setup (VibeShield)

```bash
# Navigate to web app directory
cd vibe-shield

# Install dependencies
npm install
# or with bun:
bun install

# Start development server
npm run dev
# or:
bun run dev
```

The web app will be available at `http://localhost:5173`

### 3️⃣ Browser Extension Setup

```bash
# Navigate to extension directory
cd respectrewrite-extension
```

**Install in Chrome/Edge:**
1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `respectrewrite-extension` folder
5. The extension is now active!

## 💻 Usage

### Using the API Directly

```bash
curl -X POST "http://localhost:8000/rewrite" \
  -H "Content-Type: application/json" \
  -d '{"text": "Your toxic text here"}'
```

### Using the Browser Extension

1. Browse any website
2. Type a comment
3. If harmful content is detected, you'll see a suggestion overlay
4. Click to replace with a respectful alternative

### Using the Web Platform

1. Navigate to `http://localhost:5173`
2. Sign up / Log in
3. Explore features:
   - **Dashboard**: Overview of your stats
   - **Analytics**: Detailed insights
   - **Missions**: Complete challenges
   - **Community**: Join the movement
   - **Leaderboard**: See top contributors

## 📁 Project Structure

```
projet/
├── app.py                          # FastAPI backend server
├── .env                            # Environment variables (API keys)
├── README.md                       # This file
│
├── respectrewrite-extension/        # Browser Extension
│   ├── manifest.json               # Extension configuration
│   ├── content.js                  # Content script (page monitoring)
│   ├── background.js               # Background service worker
│   ├── styles.css                  # Extension UI styles
│   ├── llm.py                      # Python LLM integration
│   └── icons/                      # Extension icons
│
└── vibe-shield/                    # React Web Application
    ├── src/
    │   ├── App.tsx                 # Main app component
    │   ├── main.tsx                # Entry point
    │   ├── pages/                  # Page components
    │   │   ├── Dashboard.tsx       # Main dashboard
    │   │   ├── Analytics.tsx       # Analytics view
    │   │   ├── Missions.tsx        # Gamification missions
    │   │   ├── Community.tsx       # Community features
    │   │   ├── Leaderboard.tsx     # Rankings
    │   │   ├── Journey.tsx         # Personal progress
    │   │   └── ...
    │   ├── components/             # Reusable components
    │   │   ├── ui/                 # shadcn/ui components
    │   │   └── ...
    │   └── services/               # API services
    ├── package.json                # Dependencies
    └── vite.config.ts              # Vite configuration
```

## 🛠️ Technologies

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Groq](https://groq.com/)** - Ultra-fast LLM inference (Llama models)
- **[Detoxify](https://github.com/unitaryai/detoxify)** - Toxic comment classification
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server

### Frontend
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[TanStack Query](https://tanstack.com/query)** - Data fetching

### Browser Extension
- **Manifest V3** - Modern Chrome extension API
- **Content Scripts** - Page interaction
- **Chrome Storage API** - User preferences

## 📚 API Documentation

### POST `/rewrite`

Analyzes text for toxicity and returns a respectful rewrite if needed.

**Request:**
```json
{
  "text": "Your text to analyze"
}
```

**Response:**
```json
{
  "original": "original text",
  "rewritten": "respectful version",
  "is_toxic": true,
  "toxicity_score": 0.85,
  "message": "Text was rewritten for respectfulness"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

**Example:**
```python
import requests

response = requests.post(
    "http://localhost:8000/rewrite",
    json={"text": "Your message here"}
)
print(response.json())
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing fast LLM inference
- **Detoxify** for toxicity detection models
- **shadcn/ui** for beautiful UI components
- The open-source community

## 📞 Contact

- **Project Lead**: Montassar Nawara
- **GitHub**: [@Montassarnawara](https://github.com/Montassarnawara)
- **Repository**: [KINDR-GROUP](https://github.com/Montassarnawara/KINDR-GROUP)

---

<div align="center">
  
**Made with ❤️ to make the internet a kinder place**

⭐ Star this repo if you believe in respectful online communication!

</div>
