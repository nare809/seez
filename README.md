# Seez

A streaming platform for movies and TV shows.

## Project Setup

This project uses React, Webpack, and Firebase. Due to PowerShell execution policy restrictions, we've created command files to simplify running the project.

### Installation

```
# Clone the repository
git clone https://github.com/nare809/seez.git
cd seez

# Install dependencies (if you face PowerShell restrictions)
# Run these command files:
npm install
```

### Development

```
# Start the development server on port 9001
npm run dev
```

### Production Build

```
# Build for production
npm run build
```

## Recent Optimizations

1. **Code Splitting**: Implemented with React.lazy and Suspense to reduce initial bundle size.
2. **Asset Compression**: Added gzip compression for static assets.
3. **Bundle Analysis**: Added bundle analyzer for performance monitoring.
4. **Performance Improvements**: Added preload hints for critical resources.
5. **Webpack Configuration**: Optimized splitChunks to avoid path issues and improve caching.
6. **Sass Warning Suppression**: Configured sass-loader to quiet deprecation warnings.

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/containers` - Container components
  - `/Firebase` - Firebase integration
- `/public` - Static assets
- `/dist` - Production build output 