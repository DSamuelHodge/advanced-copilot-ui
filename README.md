<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Advanced Copilot UI

An AI-powered chat interface for generating React components with live code previews. Built with React, TypeScript, and Google Gemini API.

## Concept

Advanced Copilot UI is an experimental AI Engineer assistant that transforms natural language prompts into production-ready React components. It features a unique "Artifact System" that renders generated code in an interactive IDE-like panel with:

- **Live Code Previews** - View generated components in real-time
- **Version History** - Track and revert to previous iterations
- **Dual View Modes** - Toggle between Preview and Code views
- **IDE-like Controls** - Resizable panels, syntax highlighting, full-screen editing

## Features

- Conversational AI interface powered by Gemini
- Model selection (Gemini 3 Pro / Flash)
- Default and Edits modes for iterative development
- Artifact system for code generation display
- Version history with search and revert
- Copy, Save, Export functionality

## Getting Started

### Prerequisites

- Node.js 18+
- Gemini API Key

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API (@google/genai)
- React Markdown

## License

MIT
