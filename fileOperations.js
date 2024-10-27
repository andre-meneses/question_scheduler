// fileOperations.js

const fs = require('fs');
const path = require('path');

class FileOperations {
    constructor(filename = 'questions.json') {
        this.filename = filename;
        this.filepath = path.join(process.cwd(), filename);
        this.ensureFileExists();
    }

    // Ensure the JSON file exists, create it if it doesn't
    ensureFileExists() {
        if (!fs.existsSync(this.filepath)) {
            this.writeData([]);
        }
    }

    // Read all questions from the file
    readData() {
        try {
            const data = fs.readFileSync(this.filepath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading questions file:', error);
            return [];
        }
    }

    // Write questions to the file
    writeData(data) {
        try {
            fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing to questions file:', error);
            return false;
        }
    }

    // Add a new question
    addQuestion(question) {
        try {
            const questions = this.readData();
            questions.push(question);
            return this.writeData(questions);
        } catch (error) {
            console.error('Error adding question:', error);
            return false;
        }
    }

    // Update an existing question
    updateQuestion(questionId, updatedQuestion) {
        try {
            const questions = this.readData();
            const index = questions.findIndex(q => q.id === questionId);
            if (index !== -1) {
                questions[index] = updatedQuestion;
                return this.writeData(questions);
            }
            return false;
        } catch (error) {
            console.error('Error updating question:', error);
            return false;
        }
    }

    // Delete a question
    deleteQuestion(questionId) {
        try {
            const questions = this.readData();
            const filteredQuestions = questions.filter(q => q.id !== questionId);
            return this.writeData(filteredQuestions);
        } catch (error) {
            console.error('Error deleting question:', error);
            return false;
        }
    }
}

module.exports = FileOperations;