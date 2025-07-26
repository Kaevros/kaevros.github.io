# AI Agent Instructions for kaevros.github.io

## Project Overview
This is a modern, static blog/portfolio website built with a custom static site generator. The site features a sophisticated sidebar navigation, search functionality, and various interactive components.

## Architecture

### Core Components
- **Static Site Generator**: Custom Node.js-based (`build.js` and `build_modules/`)
- **Template System**: HTML templates in `_templates/` with content in `_pages/` and `_posts/`
- **Asset Pipeline**: Structured CSS/JS in `assets/` with modular organization

### Key Files and Directories
```
build.js                 # Main build script
build_modules/          # Build system modules
_includes/             # Reusable HTML components
_pages/                # Static pages
_posts/                # Blog posts
assets/
  ├─ css/             # Modular CSS files
  │  ├─ _base.css     # Base styles
  │  ├─ _components.css # Component styles
  │  ├─ _layout.css   # Layout styles
  │  └─ style.css     # Main CSS entry
  ├─ js/              # JavaScript modules
  │  └─ modules/      # UI components
assets/images/         # Image assets
```

## Development Workflow

### Build Process
```bash
node build.js  # Builds the entire site
```
The build process:
1. Cleans `_site/` directory
2. Processes posts and pages
3. Generates tag pages
4. Creates search index
5. Copies assets
6. Generates RSS feed

### CSS Architecture
- Uses CSS variables for theming (light/dark modes)
- Modular CSS with specific files for components, layout, and base styles
- Mobile-first responsive design
- Key variables defined in `_base.css`

### Component Patterns

#### Sidebar Navigation
- Responsive sidebar with hover states (`_components.css`)
- Icons visible in collapsed state, expand on hover
- Smooth transitions using cubic-bezier curves
- Language switching for slogans (EN/TR)

#### Search Implementation
- Modal-based search interface
- Live search results
- Blur effect overlay
- Keyboard accessibility (Escape to close)

#### Animation Conventions
- Use `cubic-bezier(0.4,0,0.2,1)` for smooth transitions
- Standard durations: 0.3s for UI, 0.45s for modals
- Consistent transform patterns for enter/exit

## Special Considerations

### Theming System
- Uses CSS variables with `--accent-color-primary` and `--accent-color-secondary`
- Theme toggle via `data-theme="light"/"dark"` on HTML element
- Colors defined in variables for consistency

### Mobile Adaptations
- Different behavior for sidebar on mobile
- Touch-friendly interaction patterns
- Specific mobile overrides in media queries

### Performance Practices
- Optimized image assets
- Efficient CSS animations
- Minimal JavaScript footprint

## Common Tasks

### Adding a New Post
1. Create markdown file in `_posts/` with proper frontmatter
2. Add images to `assets/images/posts/`
3. Run build script

### Modifying Components
1. Locate relevant section in `_components.css`
2. Follow existing animation patterns
3. Maintain mobile compatibility
4. Test in both theme modes
