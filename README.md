# MoodMuse - AI-Powered Mood Recommendations

MoodMuse is a mood-based recommendation application that provides personalized quotes, affirmations, and song recommendations tailored to your current emotional state. Powered by Google's Gemini AI, it delivers fresh and relevant content with every use.

![MoodMuse](https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1000&auto=format&fit=crop)

## Features

- **Mood-Based Recommendations**: Select your current mood (happy, sad, chill, angry, excited, or lonely) and get personalized content
- **AI-Powered Content**: Uses Google's Gemini AI for intelligent, context-aware recommendations
- **Latest Song Suggestions**: Recommends recent songs (2023-2024) with YouTube links for immediate listening
- **Varied Recommendations**: Provides different songs with each refresh for endless discovery
- **Favorites System**: Save your favorite combinations for later access
- **Responsive Design**: Works beautifully on both desktop and mobile devices

## Technologies Used

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd moodmuse-aura-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key: `VITE_GEMINI_API_KEY=your_actual_api_key_here`
   - (Optional) Set `VITE_USE_MOCK_DATA=true` to use offline mode

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Using MoodMuse

1. **Select Your Mood**: Choose from six different mood options on the mood selector page
2. **Get Recommendations**: Click "Continue" to receive personalized recommendations
3. **Listen to Songs**: Click the link icon next to songs to open them on YouTube
4. **Save Favorites**: Click the heart icon to save combinations you love
5. **Refresh Content**: Click "New Suggestions" for different recommendations while keeping the same mood
6. **View Favorites**: Access your saved recommendations on the favorites page

## Gemini API Integration

MoodMuse uses Google's Gemini AI to generate personalized content. When the API key is configured correctly, each request will provide:

- A quote matching your selected mood
- A positive affirmation to help navigate your emotional state
- Three recent song recommendations with YouTube links

If no API key is provided or if you set `VITE_USE_MOCK_DATA=true`, the app will fall back to using a local database of mood-based content.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── lib/            # Utility functions and API clients
├── pages/          # Main application pages
└── utils/          # Helper functions and tools
```

## Extending MoodMuse

### Adding New Moods

To add a new mood option, update the following files:
- `src/context/MoodContext.tsx`: Add the new mood type and mock content
- `src/components/MoodCard.tsx`: Add the new mood icon and color
- Update the mood selector page to include the new option

### Customizing the AI Prompt

To modify how the AI generates content, edit the prompt in `src/lib/gemini.ts`.

## Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for the Gemini API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast development environment
- [Tailwind CSS](https://tailwindcss.com/) for styling
