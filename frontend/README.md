# Interview Me - Frontend

Production-grade frontend for the Interview Me interview practice platform. Built with React, Vite, Tailwind CSS, Clerk authentication, and Stream Video SDK.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Clerk** - Authentication & user management
- **Stream Video SDK** - Real-time video/chat
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library

## 📁 Project Structure

```
src/
├── app/                    # App-level configuration
├── routes/                 # Routing configuration
│   ├── AppRoutes.jsx      # Main routes
│   └── ProtectedRoute.jsx # Auth wrapper
├── pages/                  # Page components
│   ├── Landing.jsx        # Public landing page
│   ├── Dashboard.jsx      # User dashboard
│   ├── Sessions.jsx       # Browse sessions
│   ├── SessionRoom/       # Video session room
│   └── Profile.jsx        # User profile
├── components/            # Reusable components
│   ├── common/           # Generic components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── Loader.jsx
│   ├── layout/           # Layout components
│   │   ├── TopNav.jsx
│   │   └── Footer.jsx
│   ├── session/          # Session-specific
│   │   └── SessionCard.jsx
│   └── modals/           # Modal dialogs
│       └── CreateSessionModal.jsx
├── hooks/                 # Custom React hooks
│   ├── useDarkMode.js
│   └── useStreamToken.js
├── services/              # API services
│   ├── api.js            # Axios instance
│   ├── session.service.js
│   └── chat.service.js
├── store/                 # Zustand stores
│   ├── ui.store.js
│   └── session.store.js
├── providers/             # Context providers
│   └── ThemeProvider.jsx
├── utils/                 # Utilities
│   └── constants.js
├── App.jsx               # Root component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see backend README)
- Clerk account & publishable key
- Stream account & API key

### Installation

1. **Clone and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`:**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_BACKEND_URL=http://localhost:5000
   VITE_API_PREFIX=/api/v1
   VITE_STREAM_API_KEY=...
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to `http://localhost:5173`

## 🔑 Features

### Authentication
- Clerk-powered authentication
- Protected routes with automatic redirects
- Session management
- User profile integration

### Sessions
- Create interview sessions with difficulty levels
- Browse and filter active sessions
- Join sessions with real-time updates
- Session history tracking

### Video Calls
- Stream Video SDK integration
- Real-time video/audio
- Screen sharing capabilities
- Participant management
- Call controls (mute, camera, leave)

### UI/UX
- Dark/Light/System theme support
- Fully responsive design
- Accessible components
- Loading states & error handling
- Toast notifications

## 📡 API Integration

All API calls are centralized in `/services`:

- **Session Service** - CRUD operations for sessions
- **Chat Service** - Stream token generation
- **API Instance** - Configured Axios with interceptors

### Authentication Flow

1. User signs in via Clerk
2. Clerk provides JWT token
3. Token injected into API requests via interceptor
4. Backend validates token using Clerk middleware

## 🎨 Theme System

Theme managed via Zustand store:

```javascript
import useDarkMode from './hooks/useDarkMode';

const { theme, isDarkMode, setTheme, toggleTheme } = useDarkMode();
```

Three modes:
- `light` - Light theme
- `dark` - Dark theme
- `system` - Follow system preference

## 🧩 State Management

### UI Store (`ui.store.js`)
- Theme preferences
- Modal states
- Loading indicators
- Notifications

### Session Store (`session.store.js`)
- Active sessions list
- Recent sessions
- Current session details
- Loading states

## 🔐 Protected Routes

Wrap any route with `<ProtectedRoute>`:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🎥 Video Session Implementation

SessionRoom uses Stream Video SDK:

```jsx
const { streamToken } = useStreamToken();

const client = new StreamVideoClient({
  apiKey: STREAM_API_KEY,
  user: { id, name, image },
  token: streamToken.token,
});

const call = client.call('default', sessionId);
await call.join({ create: true });
```

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

Output in `/dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment

Deploy `/dist` to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static host

**Environment Variables:** Configure in your hosting platform.

## 🧪 Development Tips

### Code Style
- Use functional components
- Named exports for components
- Clear prop types
- Descriptive variable names

### Best Practices
- Keep components small & focused
- Extract reusable logic to hooks
- Use services for API calls
- Handle loading & error states
- Mobile-first responsive design

### Adding New Features

1. **New Page:**
   - Create in `/pages`
   - Add route in `AppRoutes.jsx`
   - Add to `ROUTES` constant

2. **New Component:**
   - Create in appropriate `/components` subdirectory
   - Export and import where needed

3. **New API Endpoint:**
   - Add to `constants.js`
   - Create service function in `/services`

## 📝 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Clerk Not Loading
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure Clerk domain is whitelisted

### Stream Video Issues
- Verify `VITE_STREAM_API_KEY` is correct
- Check backend `/chat/token` endpoint
- Ensure CORS is configured

### API Connection Fails
- Verify backend is running
- Check `VITE_BACKEND_URL` matches backend port
- Inspect network tab for errors

### Dark Mode Not Working
- Clear localStorage
- Check browser console
- Verify Tailwind config has `darkMode: 'class'`

## 📚 Documentation

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk Docs](https://clerk.com/docs)
- [Stream Video SDK](https://getstream.io/video/docs/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Follow existing code structure
2. Use descriptive commit messages
3. Test thoroughly before PR
4. Update README if needed

## 📄 License

MIT License - See backend for details.

---

**Built with ❤️ for interview preparation**