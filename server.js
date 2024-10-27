// server.js
const express = require('express');
const bodyParser = require('body-parser');
const FileOperations = require('./fileOperations');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const fileOps = new FileOperations();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/questions', (req, res) => {
    try {
        const questions = fileOps.readData();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

app.post('/api/questions', (req, res) => {
    try {
        const question = {
            id: Date.now(),
            ...req.body,
            created: new Date().toISOString(),
            status: 'new',
            attempts: [],
            timeSpent: 0,
            solvedIndependently: null,
            lastAttempt: null,
            skipped: false
        };
        
        fileOps.addQuestion(question);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add question' });
    }
});

app.put('/api/questions/:id', (req, res) => {
    try {
        const success = fileOps.updateQuestion(parseInt(req.params.id), req.body);
        if (success) {
            res.json(req.body);
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update question' });
    }
});

app.delete('/api/questions/:id', (req, res) => {
    try {
        const success = fileOps.deleteQuestion(parseInt(req.params.id));
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});