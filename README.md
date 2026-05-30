# Charles Garcia - Desktop Portfolio

A creative portfolio website designed like a desktop operating system, built with React and Vite. This interactive experience features draggable windows, a functional taskbar, and multiple applications showcasing my work and skills.

## Features

- 🖥️ **Desktop-like Interface** - Familiar OS-inspired UI with draggable windows
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🚀 **Interactive Apps**:
  - About Me - Personal introduction
  - Projects - Showcase of my work
  - Skills - Technical proficiencies with proficiency levels
  - Contact - Get in touch and contact information
  - Terminal - Interactive command-line interface
- 🎨 **Modern Design** - Beautiful gradient backgrounds and smooth animations
- ⚡ **Fast & Optimized** - Built with Vite for optimal performance

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Draggable** - Window dragging functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or navigate to this project directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will automatically open in your default browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── apps/
│   │   ├── AboutApp.jsx
│   │   ├── ProjectsApp.jsx
│   │   ├── SkillsApp.jsx
│   │   ├── ContactApp.jsx
│   │   └── TerminalApp.jsx
│   ├── Desktop.jsx
│   ├── DesktopIcon.jsx
│   ├── Window.jsx
│   └── Taskbar.jsx
├── App.jsx
└── main.jsx
```

## How to Use

1. **Click desktop icons** to open applications
2. **Drag windows** by their title bars to move them around
3. **Use the taskbar** at the bottom to manage open applications
4. **Minimize/Close windows** with the buttons in the title bar
5. **Use the Terminal** to explore available commands

## Customization

To customize the portfolio:

1. **Edit App Data**: Modify the portfolio data in each app component
2. **Change Colors**: Update the color values in styled components
3. **Add New Apps**: Create new components in `src/components/apps/`
4. **Modify Desktop Icons**: Edit the `desktopIcons` array in `Desktop.jsx`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Optimized bundle size with Vite
- Lazy-loaded components
- Smooth animations at 60fps

## Future Enhancements

- [ ] File system simulation
- [ ] Resizable windows
- [ ] Local storage for app state
- [ ] Dark/Light theme toggle
- [ ] Additional applications

## License

This project is open source and available under the MIT License.

## Contact

Feel free to reach out through the Contact app or visit my social profiles!

---

Built with ❤️ by Charles Garcia
