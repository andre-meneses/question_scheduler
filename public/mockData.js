// mockData.js
const mockQuestions = [
    {
        id: 1,
        source: "Rudin Chapter 1",
        problem: "Prove that between any two distinct real numbers $a < b$, there is at least one rational number $r$ such that $a < r < b$.",
        totalTime: 3,
        remainingTime: 180,
        subject: "Real Analysis",
        status: "new",
        attempts: [],
        timeSpent: 0,
        solvedIndependently: null,
        neverLookUp: false,
        created: new Date().toISOString()
    },
    {
        id: 2,
        source: "Advanced Calculus",
        problem: "Show that if $f$ is differentiable at $a$, then $$\\lim_{h \\to 0} \\frac{f(a+h) - f(a-h)}{2h} = f'(a)$$",
        totalTime: 6,
        remainingTime: 360,
        subject: "Calculus",
        status: "new",
        attempts: [],
        timeSpent: 0,
        solvedIndependently: null,
        neverLookUp: false,
        created: new Date().toISOString()
    },
    {
        id: 3,
        source: "Linear Algebra",
        problem: "Let $A$ be an $n \\times n$ matrix. Prove that if $\\det(A) \\neq 0$, then the columns of $A$ form a basis for $\\mathbb{R}^n$.",
        totalTime: 9,
        remainingTime: 540,
        subject: "Linear Algebra",
        status: "new",
        attempts: [],
        timeSpent: 0,
        solvedIndependently: null,
        neverLookUp: true,
        created: new Date().toISOString()
    }
];