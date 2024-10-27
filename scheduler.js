// scheduler.js
class QuestionScheduler {
    constructor() {
        localStorage.clear();
        this.questions = JSON.parse(localStorage.getItem('questions')) || mockQuestions;
        this.currentQuestion = null;
        this.saveState();
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    addQuestion(questionData) {
        // Ensure neverLookUp is a boolean
        const question = {
            id: Date.now(),
            source: questionData.source,
            problem: questionData.problem,
            totalTime: questionData.totalTime,
            remainingTime: questionData.totalTime * 60, // Convert hours to minutes
            subject: questionData.subject,
            status: 'new',
            attempts: [],
            timeSpent: 0,
            solvedIndependently: null,
            created: new Date().toISOString(),
            lastAttempt: null,
            neverLookUp: Boolean(questionData.neverLookUp), // Ensure boolean
            skipped: false
        };
        
        console.log('Adding new question:', question); // Debug log
        this.questions.push(question);
        this.saveState();
        return question;
    }

    selectRandomQuestion() {
        console.log('Available questions before filter:', this.questions); // Debug log
        
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

        console.log('Available questions after filter:', availableQuestions); // Debug log

        if (availableQuestions.length === 0) {
            alert('No available questions. All questions are either completed, need rest time, or time has expired.');
            return null;
        }

        this.currentQuestion = this.getRandomItem(availableQuestions);
        this.currentQuestion.status = 'in-progress';
        this.currentQuestion.currentSessionTime = this.getNextSessionDuration(this.currentQuestion.attempts.length);
        this.currentQuestion.lastAttempt = new Date().toISOString();
        
        console.log('Selected question:', this.currentQuestion); // Debug log
        
        this.saveState();
        return this.currentQuestion;
    }

    getNextSessionDuration(attemptCount) {
        const durations = [15, 30, 60];
        return durations[Math.min(attemptCount, durations.length - 1)];
    }

    completeQuestion(result, timeSpent) {
        if (!this.currentQuestion) return;

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

        this.currentQuestion = null;
        this.saveState();
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

    saveState() {
        localStorage.setItem('questions', JSON.stringify(this.questions));
        localStorage.setItem('currentQuestion', JSON.stringify(this.currentQuestion));
    }
}