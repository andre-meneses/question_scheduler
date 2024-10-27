// app.js
let scheduler;
let timerInterval;
let latexPreviewTimeout;


window.onload = function() {
    scheduler = new QuestionScheduler();
    setupEventListeners();
    updateUI();
};

function setupEventListeners() {
    const addQuestionForm = document.getElementById('addQuestionForm');
    if (addQuestionForm) {
        addQuestionForm.addEventListener('submit', handleAddQuestion);
    }

    // Add LaTeX preview functionality
    const problemTextarea = document.getElementById('problem');
    if (problemTextarea) {
        problemTextarea.addEventListener('input', handleLatexPreview);
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
}

function handleLatexPreview() {
    clearTimeout(latexPreviewTimeout);
    latexPreviewTimeout = setTimeout(() => {
        const problemText = document.getElementById('problem').value;
        const previewDiv = document.getElementById('problemPreview');
        
        try {
            // First clear the preview div
            previewDiv.innerHTML = '';
            
            // Split by display math delimiters (\[...\] and $$...$$)
            const parts = problemText.split(/(\$\$[^$]*\$\$|\\\[[^\]]*\\\])/g);
            
            parts.forEach(part => {
                if ((part.startsWith('$$') && part.endsWith('$$')) || 
                    (part.startsWith('\\[') && part.endsWith('\\]'))) {
                    // Display math
                    const mathText = part.startsWith('$$') ? 
                        part.slice(2, -2) : 
                        part.slice(2, -2);  // Remove \[ and \]
                    const mathDiv = document.createElement('div');
                    katex.render(mathText, mathDiv, {
                        displayMode: true,
                        throwOnError: false
                    });
                    previewDiv.appendChild(mathDiv);
                } else {
                    // Regular text potentially containing inline math
                    // Split by inline math delimiters ($...$ and \(...\))
                    const inlineParts = part.split(/(\$[^$]*\$|\\\([^)]*\\\))/g);
                    const textDiv = document.createElement('div');
                    
                    inlineParts.forEach(inlinePart => {
                        if ((inlinePart.startsWith('$') && inlinePart.endsWith('$')) ||
                            (inlinePart.startsWith('\\(') && inlinePart.endsWith('\\)'))) {
                            // Inline math
                            const inlineMathText = inlinePart.startsWith('$') ?
                                inlinePart.slice(1, -1) :
                                inlinePart.slice(2, -2);  // Remove \( and \)
                            const span = document.createElement('span');
                            katex.render(inlineMathText, span, {
                                displayMode: false,
                                throwOnError: false
                            });
                            textDiv.appendChild(span);
                        } else {
                            // Regular text
                            textDiv.appendChild(document.createTextNode(inlinePart));
                        }
                    });
                    
                    previewDiv.appendChild(textDiv);
                }
            });
        } catch (e) {
            console.error('LaTeX preview error:', e);
            previewDiv.innerHTML = `<span style="color: red;">LaTeX preview error: ${e.message}</span>`;
        }
    }, 300); // Debounce the preview update
}


function handleAddQuestion(event) {
    event.preventDefault();
    
    const questionData = {
        source: document.getElementById('source').value,
        problem: document.getElementById('problem').value,
        totalTime: parseInt(document.getElementById('totalTime').value),
        remainingTime: parseInt(document.getElementById('totalTime').value) * 60,
        subject: document.getElementById('subject').value,
        neverLookUp: document.getElementById('neverLookUp').checked
    };

    scheduler.addQuestion(questionData);
    event.target.reset();
    updateUI();
    switchTab('list');
}

function handleNextQuestion() {
    clearInterval(timerInterval);
    scheduler.selectRandomQuestion();
    updateUI();
}

function completeCurrentQuestion(result) {
    if (!scheduler.currentQuestion) return;
    
    clearInterval(timerInterval);
    const timeSpent = scheduler.currentQuestion.currentSessionTime;
    scheduler.completeQuestion(result, timeSpent);
    updateUI();
}

function startSessionTimer(minutes) {
    clearInterval(timerInterval);
    let timeLeft = minutes * 60;
    
    function updateTimer() {
        const minutesLeft = Math.floor(timeLeft / 60);
        const secondsLeft = timeLeft % 60;
        const timerElement = document.getElementById('sessionTimer');
        
        if (timerElement) {
            timerElement.textContent = 
                `Time remaining: ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Session time is up!');
                if (!scheduler.currentQuestion.neverLookUp) {
                    completeCurrentQuestion('not-solved');
                }
            }
            timeLeft--;
        } else {
            clearInterval(timerInterval);
        }
    }
    
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.getElementById('currentTab').style.display = 'none';
    document.getElementById('addTab').style.display = 'none';
    document.getElementById('listTab').style.display = 'none';
    
    document.getElementById(`${tab}Tab`).style.display = 'block';
}

function updateCurrentQuestion() {
    const container = document.getElementById('currentQuestion');
    const question = scheduler.currentQuestion;
    
    if (question) {
        container.innerHTML = `
            <div class="question-card ${question.neverLookUp ? 'never-lookup' : ''}">
                <h3>${question.source}</h3>
                <p class="problem-text">${question.problem}</p>
                <div class="question-details">
                    <p><strong>Total Time Remaining:</strong> ${(question.remainingTime / 60).toFixed(1)} hours</p>
                    <p><strong>Current Session Time:</strong> ${question.currentSessionTime} minutes</p>
                    <p><strong>Subject:</strong> ${question.subject}</p>
                    <p><strong>Type:</strong> ${question.neverLookUp ? 'Never Look Up' : 'Regular'}</p>
                    <p><strong>Attempts:</strong> ${question.attempts.length}</p>
                </div>
                <div class="timer" id="sessionTimer">
                    Time remaining: ${question.currentSessionTime}:00
                </div>
                <div class="button-group">
                    <button class="btn btn-success" onclick="completeCurrentQuestion('solved')">
                        Solved
                    </button>
                    <button class="btn btn-warning" onclick="completeCurrentQuestion('not-solved')">
                        Not Solved
                    </button>
                    <button class="btn btn-secondary" onclick="completeCurrentQuestion('skipped')">
                        Skip for Later
                    </button>
                </div>
            </div>
        `;
        
        // Render LaTeX in the current question
        if (window.MathJax) {
            MathJax.typesetPromise([container]).catch((err) => console.log('MathJax error:', err));
        }
        
        startSessionTimer(question.currentSessionTime);
    } else {
        container.innerHTML = `
            <div class="empty-state">
                <p>No question selected</p>
                <button class="btn" onclick="handleNextQuestion()">Get Next Question</button>
            </div>
        `;
    }
}

// Modify the updateQuestionList function to properly render LaTeX
function updateQuestionList() {
    const container = document.getElementById('questionList');
    
    if (scheduler.questions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No questions added yet. Add some questions to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = scheduler.questions.map(q => `
        <div class="question-card ${q.status} ${q.neverLookUp ? 'never-lookup' : ''}">
            <h3>${q.source}</h3>
            <p class="problem-text">${q.problem}</p>
            <div class="question-details">
                <p><strong>Status:</strong> <span class="status-badge ${q.status}">${q.status}</span></p>
                <p><strong>Type:</strong> ${q.neverLookUp ? 'Never Look Up' : 'Regular'}</p>
                <p><strong>Remaining Time:</strong> ${(q.remainingTime / 60).toFixed(1)} hours</p>
                <p><strong>Subject:</strong> ${q.subject}</p>
                ${q.status === 'completed' ? 
                    `<p><strong>Solved Independently:</strong> ${q.solvedIndependently ? 'Yes' : 'No'}</p>` 
                    : ''}
                <p><strong>Attempts:</strong> ${q.attempts.length}</p>
            </div>
            ${q.attempts.length > 0 ? `
                <div class="attempts-history">
                    <h4>Attempt History</h4>
                    ${q.attempts.map((attempt, index) => `
                        <div class="attempt">
                            <p>Attempt ${index + 1}: ${new Date(attempt.date).toLocaleDateString()}</p>
                            <p>Time spent: ${attempt.timeSpent} minutes</p>
                            <p>Result: ${attempt.result}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');

    // Render LaTeX in the question list
    if (window.MathJax) {
        MathJax.typesetPromise([container]).catch((err) => console.log('MathJax error:', err));
    }
}

function updateStats() {
    const stats = scheduler.getStats();
    document.getElementById('totalQuestions').textContent = stats.total;
    document.getElementById('completedQuestions').textContent = stats.completed;
    document.getElementById('inProgressQuestions').textContent = stats.inProgress;
    document.getElementById('neverLookUpSolved').textContent = 
        `${stats.neverLookUpSolved}/${stats.neverLookUpTotal}`;
}

function updateUI() {
    updateStats();
    updateCurrentQuestion();
    updateQuestionList();
}

window.handleNextQuestion = handleNextQuestion;
window.completeCurrentQuestion = completeCurrentQuestion;
window.switchTab = switchTab;