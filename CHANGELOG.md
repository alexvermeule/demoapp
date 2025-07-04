# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Spaced repetition algorithm implementation
- User authentication with Clerk.com
- Database integration with Prisma + SQLite
- AI-powered flashcard generation

## [0.2.0] - 2024-12-19

### Added
- **Flashcard Component**: Interactive flashcard with 3D flip animation
- **FlashcardForm Component**: Form for creating and editing flashcards
- **FlashcardApp Component**: Main app with state management and CRUD operations
- **3D CSS Utilities**: Custom CSS for smooth flip animations
- **Responsive Design**: Mobile-friendly grid layout
- **Empty State**: User-friendly empty state with call-to-action
- **Statistics**: Card count display

### Features
- Create new flashcards with front/back content
- Edit existing flashcards inline
- Delete flashcards with confirmation
- Interactive flip animation on click
- Form validation for required fields
- Responsive grid layout (1/2/3 columns)
- Clean, modern UI with Tailwind CSS

### Technical
- TypeScript interfaces for type safety
- React hooks for state management
- Client-side components with 'use client'
- Crypto.randomUUID() for unique IDs
- CSS-in-JS approach with Tailwind utilities

## [0.1.0] - 2024-12-19

### Added
- Initial Next.js 15 project setup with TypeScript
- Tailwind CSS configuration
- ESLint configuration
- GitHub repository integration
- Development environment setup
- Basic project structure with App Router

### Infrastructure
- Node.js 20.19.3 runtime
- npm 10.8.2 package manager
- Turbopack for fast development builds
- Git version control with proper commit history

### Documentation
- README.md with project overview
- CLAUDE.md with development guidelines
- Project roadmap for flashcard application
- CHANGELOG.md with semantic versioning
- Tech stack documentation with AWS migration path

[Unreleased]: https://github.com/alexvermeule/demoapp/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/alexvermeule/demoapp/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/alexvermeule/demoapp/releases/tag/v0.1.0 