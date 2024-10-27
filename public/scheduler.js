// scheduler.js
class QuestionScheduler {
    constructor() {
        this.questions = [];
        this.currentQuestion = null;
        this.loadQuestions(); // Initial load
        
        // Try to restore current question from localStorage
        const savedCurrentQuestion = localStorage.getItem('currentQuestion');
        if (savedCurrentQuestion) {
            this.currentQuestion = JSON.parse(savedCurrentQuestion);
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/questions');
            if (!response.ok) throw new Error('Failed to fetch questions');
            this.questions = await response.json();
            this.saveCurrentQuestionToLocal();
            updateUI(); // Update UI after loading
        } catch (error) {
            console.error('Error loading questions:', error);
            // Fallback to mock data if available
            if (typeof mockQuestions !== 'undefined') {
                this.questions = mockQuestions;
                this.questions.forEach(q => this.addQuestion(q));
            }
            updateUI();
        }
    }

    async addQuestion(questionData) {
        try {
            const question = {
                ...questionData,
                remainingTime: questionData.totalTime * 60, // Convert hours to minutes
                status: 'new',
                attempts: [],
                timeSpent: 0,
                solvedIndependently: null,
                created: new Date().toISOString(),
                lastAttempt: null,
                neverLookUp: Boolean(questionData.neverLookUp),
                skipped: false
            };

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(question)
            });

            if (!response.ok) throw new Error('Failed to add question');
            const savedQuestion = await response.json();
            
            // Add to local array
            this.questions.push(savedQuestion);
            
            // Force a UI update
            updateUI();
            
            return savedQuestion;
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }

    async updateQuestion(questionId, questionData) {
        try {
            const response = await fetch(`/api/questions/${questionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionData)
            });

            if (!response.ok) throw new Error('Failed to update question');
            const updatedQuestion = await response.json();
            const index = this.questions.findIndex(q => q.id === questionId);
            if (index !== -1) {
                this.questions[index] = updatedQuestion;
            }
            return updatedQuestion;
        } catch (error) {
            console.error('Error updating question:', error);
            return null;
        }
    }

    async deleteQuestion(questionId) {
        try {
            const response = await fetch(`/api/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to delete question');
            
            // Remove the question from the local array
            this.questions = this.questions.filter(q => q.id !== questionId);
            
            // If the deleted question was the current question, clear it
            if (this.currentQuestion && this.currentQuestion.id === questionId) {
                this.currentQuestion = null;
                this.saveCurrentQuestionToLocal();
            }
            
            updateUI();
            return true;
        } catch (error) {
            console.error('Error deleting question:', error);
            return false;
        }
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectRandomQuestion() {
        console.log('Available questions before filter:', this.questions);
        
        const availableQuestions = this.questions.filter(q => {
            // Skip completed questions
            if (q.status === 'completed') return false;
            
            // For never look up questions, only check if they're solved
            if (q.neverLookUp === true) {
                return q.solvedIndependently !== true;
            }
            
            // For regular questions, check time and status
            if (q.remainingTime <= 0 && !q.neverLookUp) {
                // Automatically mark as completed if time is up
                q.status = 'completed';
                q.skipped = true;
                return false;
            }
            
            // Check rest time between attempts
            if (q.lastAttempt) {
                const hoursSinceLastAttempt = 
                    (new Date() - new Date(q.lastAttempt)) / (1000 * 60 * 60);
                if (hoursSinceLastAttempt < 3) return false;
            }
            
            return true;
        });

        console.log('Available questions after filter:', availableQuestions);

        if (availableQuestions.length === 0) {
            alert('No available questions. All questions are either completed, need rest time, or time has expired.');
            return null;
        }

        const selectedQuestion = this.getRandomItem(availableQuestions);
        if (selectedQuestion) {
            this.currentQuestion = selectedQuestion;
            this.currentQuestion.status = 'in-progress';
            this.currentQuestion.currentSessionTime = this.getNextSessionDuration(this.currentQuestion.attempts.length);
            this.currentQuestion.lastAttempt = new Date().toISOString();
            
            // Update the question in the backend
            this.updateQuestion(this.currentQuestion.id, this.currentQuestion);
            this.saveCurrentQuestionToLocal();
        }
        
        return this.currentQuestion;
    }

    getNextSessionDuration(attemptCount) {
        const durations = [15, 30, 60];
        return durations[Math.min(attemptCount, durations.length - 1)];
    }

    async completeQuestion(result, timeSpent) {
        if (!this.currentQuestion) return;

        // Clear timer if it exists
        if (window.timerInterval) {
            clearInterval(window.timerInterval);
            window.timerInterval = null;
        }

        const question = this.currentQuestion;
        
        // Update attempt record
        question.attempts.push({
            date: new Date().toISOString(),
            timeSpent: timeSpent,
            result: result
        });

        // Update question stats
        question.timeSpent += timeSpent;
        question.remainingTime -= timeSpent;

        switch(result) {
            case 'solved':
                question.solvedIndependently = true;
                question.status = 'completed';
                break;
            
            case 'not-solved':
                question.solvedIndependently = false;
                // For never look up questions, keep them in rotation
                if (question.neverLookUp === true) {
                    question.status = 'attempted';
                } else if (question.remainingTime <= 0) {
                    // Regular questions are completed when time is up
                    question.status = 'completed';
                    question.skipped = true;
                } else {
                    question.status = 'attempted';
                }
                break;
            
            case 'skipped':
                question.skipped = true;
                if (!question.neverLookUp && question.remainingTime <= 0) {
                    question.status = 'completed';
                } else {
                    question.status = 'attempted';
                }
                break;
        }

        // Update the question in the backend
        await this.updateQuestion(question.id, question);
        
        // Clear current question and update local storage
        this.currentQuestion = null;
        this.saveCurrentQuestionToLocal();
        
        // Update UI after completion
        updateUI();
    }

    getStats() {
        const completed = this.questions.filter(q => q.status === 'completed');
        const inProgress = this.questions.filter(q => q.status === 'in-progress');
        const neverLookUp = this.questions.filter(q => q.neverLookUp === true);
        const solvedIndependently = this.questions.filter(q => q.solvedIndependently === true);
        const skipped = this.questions.filter(q => q.skipped);

        return {
            total: this.questions.length,
            completed: completed.length,
            inProgress: inProgress.length,
            solvedIndependently: solvedIndependently.length,
            neverLookUpTotal: neverLookUp.length,
            neverLookUpSolved: neverLookUp.filter(q => q.solvedIndependently === true).length,
            skipped: skipped.length,
            averageAttempts: this.calculateAverageAttempts()
        };
    }

    calculateAverageAttempts() {
        if (this.questions.length === 0) return 0;
        const totalAttempts = this.questions.reduce((sum, q) => sum + q.attempts.length, 0);
        return (totalAttempts / this.questions.length).toFixed(1);
    }

    saveCurrentQuestionToLocal() {
        localStorage.setItem('currentQuestion', JSON.stringify(this.currentQuestion));
    }
}

// Make the QuestionScheduler available globally
window.QuestionScheduler = QuestionScheduler;