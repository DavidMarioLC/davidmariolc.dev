# Portfolio

Modern portfolio built with Next.js 16, React 19, and TypeScript. Features advanced animations, interactive components, and content management through Velite.

## Tech Stack

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with compiler
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling

### Animation & Interaction

- **Motion** (Framer Motion) - React animations
- **GSAP** - Advanced animations
- **Lenis** - Smooth scroll
- **OGL** - WebGL rendering

### Content & UI

- **Velite** - Type-safe content management
- **Radix UI** - Accessible components
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel functionality

### Dev Tools

- **Biome** - Fast linting & formatting (no ESLint/Prettier needed)
- **npm-run-all** - Parallel script execution

## Features

- 🎨 **Advanced Animations** - GSAP, Motion, and custom effects
- 📱 **Responsive Design** - Mobile-first approach
- ♿ **Accessible** - Built with Radix UI primitives
- 🚀 **Performance** - React 19 compiler, optimized builds
- 📝 **Content Management** - Markdown-based projects with Velite
- 🎭 **Interactive Components** - ClickSpark, GlareHover, PixelTransition, etc.

## Getting Started

### Prerequisites

- Node.js 20+
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server (Next.js + Velite in watch mode)
npm run dev

# Or run separately
npm run dev:next    # Next.js dev server only
npm run dev:content # Velite content watcher only
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Build content and Next.js app
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── projects/          # Project pages
├── components/            # React components
│   ├── AboutCarousel.tsx  # About section carousel
│   ├── BlurText.tsx       # Text blur effects
│   ├── ClickSpark.tsx     # Click interaction effects
│   ├── FuzzyText.tsx      # Fuzzy text animation
│   ├── GlareHover.tsx     # Glare hover effects
│   └── ui/                # shadcn/ui components
├── sections/              # Page sections
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Clients.tsx
│   └── Contact.tsx
├── content/               # Markdown content
│   └── projects/          # Project case studies
├── lib/                   # Utilities
└── public/                # Static assets
```

## Development

### Scripts

- `npm run dev` - Start dev server (Next.js + Velite watch)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check code quality with Biome
- `npm run format` - Format code with Biome

### Adding Projects

Create a new markdown file in `content/projects/`:

```markdown
---
title: Project Name
description: Brief description
date: 2024-01-01
---

Project content here...
```

Velite will automatically process and make it available.

## Components

### Custom Components

- **AboutCarousel** - Carousel for about section
- **BlurText** - Animated text blur effects
- **CircularText** - Text arranged in circle
- **ClickSpark** - Spark effect on click
- **Dock** - macOS-style dock
- **FuzzyText** - Fuzzy/glitch text effect
- **GlareHover** - Card glare on hover
- **GradualBlur** - Progressive blur animation
- **LightRays** - Animated light ray effects
- **LogoLoop** - Infinite logo carousel
- **PixelTransition** - Pixel-based transitions
- **ProjectCard** - Project showcase cards
- **ScrollStack** - Scroll-based stacking
- **ShinyText** - Shiny text effect

### UI Components (shadcn/ui)

- Button
- Carousel
- Tooltip

## Configuration

### Biome

Configured in `biome.json` for linting and formatting. Replaces ESLint + Prettier with a single, faster tool.

### Tailwind

Latest Tailwind CSS 4 with PostCSS. Typography plugin included for markdown content.

### Velite

Content management configured in `velite.config.ts`. Processes markdown files from `content/` directory.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build command: `npm run build`  
Output directory: `.next`  
Install command: `npm install`

## License

Private

---

Built with attention to detail, performance, and user experience.
