# Question Scheduler Documentation
## Mathematical Learning System

### Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Features](#features)
4. [Usage Guide](#usage-guide)
5. [Technical Documentation](#technical-documentation)
6. [LaTeX Guide](#latex-guide)
7. [Troubleshooting](#troubleshooting)

## Overview

The Question Scheduler is a web-based system designed to help users practice mathematical problems using a structured approach. It implements a specific learning methodology that balances thorough understanding with steady progress.

### Core Principles
- Systematic approach to problem-solving
- Time management with progressive intervals
- Special handling for challenging "never look up" problems
- LaTeX support for mathematical notation
- Local storage for progress tracking

## Installation

1. Create a new directory for the project:
```bash
mkdir question-scheduler
cd question-scheduler
```

2. Create the following files:
- index.html
- styles.css
- app.js
- scheduler.js
- mockData.js

3. No server setup required - runs entirely in the browser

## Features

### 1. Question Management
- Add new questions with LaTeX support
- Random question selection
- Progress tracking
- Time management
- "Never look up" option for challenging problems

### 2. Time Management
- Progressive session durations (15min → 30min → 1hr)
- Total time allocation (3, 6, 9, or 12 hours)
- Rest periods between attempts (3 hours minimum)
- Automatic completion for time-exhausted questions

### 3. Question Types
#### Regular Questions
- Can be marked as complete when time is exhausted
- Solutions can be viewed
- Time-based completion

#### Never Look Up Questions
- Must be solved independently
- No time-based completion
- Remain in rotation until solved
- Cannot view solutions

### 4. Statistics Tracking
- Total questions
- Completed questions
- In-progress questions
- Never look up success rate
- Attempt history

## Usage Guide

### Adding Questions

1. Click the "Add Question" tab
2. Fill in the question details:
   - Source (e.g., "Rudin Chapter 3")
   - Problem description (supports LaTeX)
   - Time allocation
   - Subject matter
   - Never look up option

Example with LaTeX:
```
Let $f: [a,b] \to \mathbb{R}$ be continuous. Prove that if $$\int_a^b f(x) dx = 0$$ and $f(x) \geq 0$ for all $x \in [a,b]$, then $f(x) = 0$ for all $x \in [a,b]$.
```

### Working on Questions

1. Click "Get Next Question"
2. The system will:
   - Select a random available question
   - Start the session timer
   - Display question details

3. After attempting the question:
   - Click "Solved" if solved independently
   - Click "Not Solved" if solution was viewed
   - Click "Skip" to attempt later

### Question States
- **New**: Not yet attempted
- **In Progress**: Currently being worked on
- **Attempted**: Worked on but not completed
- **Completed**: Successfully solved or time exhausted

## Technical Documentation

### File Structure
```
question-scheduler/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── app.js          # UI logic
├── scheduler.js    # Core scheduling logic
└── mockData.js     # Sample questions
```

### Core Classes

#### QuestionScheduler
```javascript
class QuestionScheduler {
    constructor()
    addQuestion(questionData)
    selectRandomQuestion()
    completeQuestion(result, timeSpent)
    getStats()
}
```

### Data Structures

#### Question Object
```javascript
{
    id: Number,
    source: String,
    problem: String,
    totalTime: Number,        // Hours
    remainingTime: Number,    // Minutes
    subject: String,
    status: String,          // 'new'|'in-progress'|'attempted'|'completed'
    attempts: Array,
    timeSpent: Number,
    solvedIndependently: Boolean,
    neverLookUp: Boolean,
    created: Date
}
```

#### Attempt Object
```javascript
{
    date: Date,
    timeSpent: Number,
    result: String           // 'solved'|'not-solved'|'skipped'
}
```

## LaTeX Guide

### Inline Math
Use `$...$` for inline mathematical expressions:
```latex
The function $f(x) = x^2$ is continuous
```

### Display Math
Use `$$...$$` for displayed equations:
```latex
$$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

### Common LaTeX Symbols
- Greek letters: `$\alpha$`, `$\beta$`, `$\gamma$`
- Sets: `$\mathbb{R}$`, `$\mathbb{Z}$`, `$\mathbb{N}$`
- Operators: `$\sum$`, `$\prod$`, `$\int$`
- Relations: `$\leq$`, `$\geq$`, `$\neq$`
- Logic: `$\forall$`, `$\exists$`, `$\implies$`

## Troubleshooting

### Common Issues

1. **LaTeX Not Rendering**
   - Check KaTeX CDN links
   - Verify LaTeX syntax
   - Check browser console for errors

2. **Timer Issues**
   - Clear browser cache
   - Check for multiple timer instances
   - Verify time calculations

3. **Data Persistence**
   - Check localStorage availability
   - Clear localStorage if corrupted
   - Verify data structure

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Known Limitations
1. Local storage limit (5-10 MB)
2. No cloud synchronization
3. Single device usage
4. Browser restrictions apply

## Future Enhancements
1. Cloud synchronization
2. Multiple device support
3. Statistical analysis
4. Export/import functionality
5. Collaborative features
