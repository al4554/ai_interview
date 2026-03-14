# InterviewIQ - AI Mock Interview Platform

InterviewIQ is a full-stack AI mock interview SaaS application where users can practice role-based interviews, get adaptive follow-up questions, and review detailed performance reports.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- AI: Groq API
- Database: MongoDB (Mongoose)
- Authentication: JWT
- Charts: Recharts
- PDF report export: PDFKit

## Features Implemented

- Landing page with hero, features, how-it-works, testimonials, and footer
- Authentication: sign up, login, logout, protected routes
- User dashboard with score snapshots and trend chart
- Interview setup page: role, level, type, optional resume upload/text
- AI interview chat page:
  - one-question-at-a-time flow
  - adaptive feedback and follow-up
  - typing indicator
  - question counter
  - answer timer
  - browser voice input
- Feedback report page:
  - overall, communication, technical, confidence scores
  - strengths, weaknesses, improvement tips
  - downloadable PDF report
- Interview history page
- Optional admin panel: users + aggregate analytics

## Project Structure

```text
proj2/
  client/
    src/
      api/
        adminApi.js
        authApi.js
        interviewApi.js
        reportApi.js
      components/
        AnswerTimer.jsx
        AppShell.jsx
        ChatBubble.jsx
        FeatureCard.jsx
        Navbar.jsx
        ProgressChart.jsx
        ProtectedRoute.jsx
        QuestionCard.jsx
        ScoreCard.jsx
        Sidebar.jsx
        TestimonialCard.jsx
        ThemeToggle.jsx
        TypingIndicator.jsx
      hooks/
        useAuth.jsx
        useTheme.js
      pages/
        AdminPage.jsx
        DashboardPage.jsx
        HistoryPage.jsx
        InterviewPage.jsx
        InterviewSetupPage.jsx
        LandingPage.jsx
        LoginPage.jsx
        ReportPage.jsx
        SignupPage.jsx
      styles/
        index.css
      utils/
        apiClient.js
        formatters.js
        storage.js
      App.jsx
      main.jsx
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  server/
    src/
      config/
        db.js
      controllers/
        adminController.js
        authController.js
        interviewController.js
        reportController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        Interview.js
        User.js
      routes/
        adminRoutes.js
        authRoutes.js
        interviewRoutes.js
        reportRoutes.js
      services/
        groqService.js
        interviewEngine.js
      utils/
        parseModelOutput.js
        token.js
      server.js
    .env.example
    package.json
  .editorconfig
  .gitignore
  package.json
  README.md
```

## Setup Instructions

## 1) Install dependencies

Run from project root:

npm install

## 2) Configure environment variables

Create these files:

- server/.env (copy values from server/.env.example)
- client/.env (copy values from client/.env.example)

## 3) Start development servers

Run from project root:

npm run dev

This starts:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 4) Build frontend for production

npm run build --workspace client

## Environment Variables

## Server (server/.env)

- PORT=5000
- NODE_ENV=development
- MONGO_URI=mongodb://127.0.0.1:27017/ai_mock_interview
- JWT_SECRET=replace-with-long-random-string
- JWT_EXPIRES_IN=7d
- CLIENT_URL=http://localhost:5173
- GROQ_API_KEY=your-groq-api-key
- GROQ_MODEL=llama-3.3-70b-versatile

## Client (client/.env)

- VITE_API_URL=http://localhost:5000/api

## API Integration Examples

Base URL: http://localhost:5000/api

### Signup

POST /auth/signup

Body:
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "secret123"
}

### Login

POST /auth/login

Body:
{
  "email": "alex@example.com",
  "password": "secret123"
}

### Start Interview

POST /interviews/start
Authorization: Bearer <token>

Body:
{
  "jobRole": "Full Stack Engineer",
  "experienceLevel": "Mid",
  "interviewType": "Mixed",
  "resumeText": "Optional resume summary"
}

### Submit Answer

POST /interviews/:id/answer
Authorization: Bearer <token>

Body:
{
  "answer": "My answer to the current question",
  "maxQuestions": 10
}

### Complete Interview

POST /interviews/:id/complete
Authorization: Bearer <token>

### Get Report

GET /reports/:id
Authorization: Bearer <token>

### Download PDF Report

GET /reports/:id/pdf
Authorization: Bearer <token>

## Notes

- To use admin endpoints, set a user role to admin in MongoDB.
- Voice input uses browser SpeechRecognition support.
- Resume upload currently extracts raw text from file buffer; plain text resumes provide best results.
