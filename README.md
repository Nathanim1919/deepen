# Deepen

> Your AI-powered second brain for capturing, organizing, and understanding web content.

<p align="center">
  <img src="client/src/assets/img1.png" alt="Deepen Interface" width="800" />
</p>

## What is Deepen?

Deepen is a modern knowledge management platform that helps you **capture** web content, **organize** it intelligently, and **retrieve** insights instantly using AI. Think of it as your personal research assistant that never forgets.

### Key Features

- **Smart Capture** — Save articles, PDFs, and web pages with one click via browser extension
- **AI Brain Chat** — Have conversations with your captured knowledge using GPT-4, Claude, and more
- **Vector Search** — Find information by meaning, not just keywords
- **Collections & Bookmarks** — Organize content your way with folders and quick-access bookmarks
- **Multi-source Intelligence** — Query across all your captures or focus on specific collections

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, TailwindCSS 4, Zustand, TanStack Router/Query, Framer Motion |
| **Backend** | Express 5, TypeScript, MongoDB, Qdrant (Vector DB) |
| **AI** | OpenRouter (GPT-4, Claude, Gemini), Embeddings, RAG Pipeline |
| **Auth** | Better Auth |
| **Processing** | Trigger.dev (background jobs), PDF parsing |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB
- Qdrant (for vector search)
- OpenRouter API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Nathanim1919/LinkMeld-Frontend.git
cd LinkMeld-Frontend

# Install dependencies
cd client && npm install
cd ../server && npm install

# Configure environment
cp server/.env.example server/.env
# Edit .env with your API keys and database URLs

# Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:5173` to see the app.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # Zustand state management
│   │   ├── hooks/          # Custom React hooks
│   │   └── api/            # API client functions
│   └── ...
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── api/            # Routes & controllers
│   │   ├── ai/             # AI services & prompts
│   │   ├── common/         # Models, utils, config
│   │   └── trigger/        # Background job processors
│   └── ...
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT © [Nathanim](https://github.com/Nathanim1919)

---

<p align="center">
  Built with ☕ and curiosity
</p>

