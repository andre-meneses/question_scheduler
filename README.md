# Question Scheduler: A Mathematical Learning System

## Overview

The Question Scheduler is a web-based application designed to help users learn mathematics through a structured, methodical approach. It implements a specific learning methodology that balances thorough understanding with steady progress. For a detailed explanation of the learning philosophy and methodology behind this system, please see [SPECIFICATION.md](SPECIFICATION.md).

## Features

### Core Functionality
- Add and manage mathematical questions with LaTeX support
- Structured practice sessions with time management
- Random question selection based on availability and time constraints
- Progress tracking and statistics
- Special handling for "never look up" challenging problems
- Comprehensive attempt history
- Question deletion and management

### Technical Features
- Full LaTeX rendering support (KaTeX and MathJax)
- Backend persistence with Express
- Real-time preview for LaTeX input
- Session-based timer management
- Responsive design for various screen sizes

## Installation

1. Clone the repository:
```bash
git clone https://github.com/andre-meneses/question-scheduler.git
cd question-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the application at `http://localhost:3000`

## Project Structure
```
question-scheduler/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── scheduler.js
├── server.js
├── fileOperations.js
├── questions.json
├── SPECIFICATION.md
├── README.md
├── .gitignore
└── package.json
```

## Usage Guide

### Adding Questions

1. Click the "Add Question" tab
2. Fill in:
   - Source (e.g., "Rudin Chapter 3")
   - Problem description (supports LaTeX)
   - Time allocation (3, 6, 9, or 12 hours)
   - Subject matter
   - Never look up option (for problems you want to solve independently)

### LaTeX Support

Use standard LaTeX notation:
- Inline math: `$...$`
- Display math: `$$...$$`

Example:
```latex
Let $f: [a,b] \to \mathbb{R}$ be continuous. Prove that if
$$\int_a^b f(x) dx = 0$$
and $f(x) \geq 0$ for all $x \in [a,b]$, then $f(x) = 0$ for all $x \in [a,b]$.
```

### Working with Questions

1. Click "Get Next Question" to start a session
2. The system will:
   - Select an available question
   - Start a timed session
   - Track progress
3. After attempting:
   - Click "Solved" if completed independently
   - Click "Not Solved" if solution was viewed
   - Click "Skip" to attempt later

### Question States
- **New**: Not yet attempted
- **In Progress**: Currently being worked on
- **Attempted**: Worked on but not completed
- **Completed**: Successfully solved or time exhausted

## Learning Philosophy

This system implements a structured learning approach where:

1. **Regular Problems (2/3 of questions)**
   - Initial 30-minute attempt limit
   - Solution consultation allowed if needed
   - Focus on understanding and learning from solutions

2. **Advanced Problems (1/3 of questions)**
   - Longer allocated thinking time (3-12 hours)
   - Progressive attempt intervals (15min → 30min → 1hr)
   - Some marked as "never look up" for independent mastery

For more details on the learning methodology and philosophy, see [SPECIFICATION.md](SPECIFICATION.md).

## Technical Dependencies

- Node.js
- Express.js
- KaTeX (LaTeX rendering)
- MathJax (additional math rendering support)

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

Planned features:
1. Question categories and tags
2. Search and filter functionality
3. Export/import capabilities
4. Progress visualization
5. Question difficulty ratings
6. Study session summaries
7. Offline mode support
8. Mobile app version

## Acknowledgments

This project was inspired by the need for a structured approach to mathematical learning that balances thorough understanding with practical progress. The methodology is detailed in SPECIFICATION.md.
