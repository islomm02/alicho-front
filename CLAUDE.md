# Alicho Frontend Project

## Project Overview
This is a Next.js frontend application for Alicho.

## Tech Stack
- Next.js (React framework)
- TypeScript
- Tailwind CSS (based on globals.css modifications)

## Project Structure
```
app/
├── api/          # API routes
│   ├── auth/     # Authentication endpoints
│   └── setup/    # Setup/configuration endpoints
├── dashboard/    # Dashboard pages
├── login/        # Login page
├── register/     # Register page (redirects to AI setup)
├── setup/        # Setup pages
│   └── ai-config/ # AI configuration page
├── globals.css   # Global styles
├── layout.tsx    # Root layout
└── page.tsx      # Home page

components/       # Reusable components
hooks/           # Custom React hooks
lib/             # Utility libraries
```

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linting
npm test         # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Backend integration
npm run test-backend  # Start test backend server (port 8000)
npm run dev:full     # Start both frontend and backend servers
```

## Development Guidelines

### Testing Requirements
- **ALWAYS write tests** for new files and code
- **Run existing tests** when writing new code to ensure no regressions
- Test coverage should be comprehensive for all new functionality
- Use the existing test framework in the project

### Frontend Development Standards
- **Mobile-first approach** - Mobile appearance is the highest priority
- All UI components must be fully responsive and adaptive
- Design should be perfect on mobile devices first, then scale up
- Use responsive design principles with proper breakpoints
- Ensure touch-friendly interfaces and mobile UX best practices

### Code Quality
- Follow existing code conventions and patterns
- Ensure TypeScript strict mode compliance
- Write clean, maintainable, and well-documented code
- Performance optimization for mobile devices is critical

### Testing Commands
```bash
npm test          # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Features Implemented

### Authentication System
- User registration with validation
- Multi-step registration flow:
  1. Basic user information (name, email, company, password)
  2. **MANDATORY** AI configuration setup (company description, AI context, embeddings)
- Login system (API ready)
- Session management with cookies
- Browser navigation prevention (no going back during AI setup)

### AI Configuration System
- Company description setup
- AI context/guidelines for ChatGPT behavior
- Multiple embeddings for company-specific information
- Form validation and error handling
- Multi-language support (Uzbek, Russian, English)

### Testing Coverage
- Complete test suite with Jest and React Testing Library
- API endpoint tests with 100% coverage
- Component rendering and interaction tests
- Form validation tests
- Integration tests for complete user flows

## Backend Integration

### API Configuration
- **Backend URL**: `http://localhost:8000` (configured in `.env.local`)
- **API Endpoints**:
  - `POST /api/register` - User registration
  - `POST /api/setup/ai-config` - AI configuration (requires auth token)

### Expected Backend Response Format

**Registration Success:**
```json
{
  "success": true,
  "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz",
  "user": {
    "id": "user_123",
    "name": "John Doe", 
    "email": "john@example.com",
    "company_name": "Acme Corp"
  },
  "token": "jwt_token_here"
}
```

**AI Config Success:**
```json
{
  "success": true,
  "message": "AI sozlamalari muvaffaqiyatli saqlandi"
}
```

### Test Backend
- Test backend server available in `test-backend.js`
- Simulates your real backend API responses
- Use `test@existing.com` to test duplicate email error

## Notes
- Current branch: master
- Project initialized with Create Next App
- Authentication system fully implemented with backend integration
- AI configuration system implemented with backend integration
- Comprehensive testing suite in place
- Priority: Mobile-first responsive design
- **Frontend**: http://localhost:3003
- **Test Backend**: http://localhost:8000