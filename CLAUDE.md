# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router with TypeScript, React 19, and Tailwind CSS. It's a fresh project bootstrapped with `create-next-app` using Turbopack for fast development.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture
**Framework Stack:**
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Geist fonts (Sans and Mono)

**Project Structure:**
- `/app` - Next.js App Router pages and layouts
- `/app/layout.tsx` - Root layout with font configuration
- `/app/page.tsx` - Home page component
- `/app/globals.css` - Global styles
- `/public` - Static assets (SVG icons)

**Key Configurations:**
- TypeScript with strict mode and path aliases (`@/*`)
- ESLint with Next.js and TypeScript rules
- Tailwind CSS with PostCSS
- Turbopack for development bundling

## Development Notes

- The application uses Server Components by default (Next.js App Router)
- Path aliases are configured: `@/*` maps to project root
- Font optimization is handled via `next/font/google`
- Development server runs on http://localhost:3000
- Hot reload is enabled for instant updates


## Standard workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. If you have any questions (e.g. on requirements), please ask
4. Before you begin working, check in with me and I will verify the plan.
5. Then, begin working on the todo items, marking them as complete as you go.
6. Please every step of the way just give me a high level explanation of what changes you made
7. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
8. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.