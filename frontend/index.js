import { backend } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';

let authClient;
let principal;

async function init() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated();
    }
}

async function handleAuthenticated() {
    principal = await authClient.getIdentity().getPrincipal();
    document.getElementById('user-info').innerText = `Logged in as: ${principal.toString()}`;
    loadQuestions();
}

document.getElementById('register-btn').onclick = async () => {
    const username = document.getElementById('username').value;
    if (username) {
        await authClient.login({
            identityProvider: "https://identity.ic0.app",
            onSuccess: async () => {
                const result = await backend.register(username);
                if (result) {
                    alert('Registration successful!');
                    handleAuthenticated();
                } else {
                    alert('Registration failed. User might already exist.');
                }
            },
        });
    }
};

document.getElementById('ask-question-btn').onclick = async () => {
    const title = document.getElementById('question-title').value;
    const content = document.getElementById('question-content').value;
    if (title && content) {
        const questionId = await backend.askQuestion(title, content);
        alert(`Question asked successfully! Question ID: ${questionId}`);
        loadQuestions();
    }
};

async function loadQuestions() {
    const questions = await backend.getAllQuestions();
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    for (const question of questions) {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <h3>${question.title}</h3>
            <p>${question.content}</p>
            <p>Votes: ${question.votes}</p>
            <button onclick="voteQuestion(${question.id}, true)">Upvote</button>
            <button onclick="voteQuestion(${question.id}, false)">Downvote</button>
            <div class="answers" id="answers-${question.id}"></div>
            <input type="text" id="answer-${question.id}" placeholder="Your Answer">
            <button onclick="answerQuestion(${question.id})">Submit Answer</button>
        `;
        container.appendChild(questionElement);
        loadAnswers(question.id);
    }
}

async function loadAnswers(questionId) {
    const answers = await backend.getAnswersForQuestion(questionId);
    const container = document.getElementById(`answers-${questionId}`);
    container.innerHTML = '';
    for (const answer of answers) {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.innerHTML = `
            <p>${answer.content}</p>
            <p>Votes: ${answer.votes}</p>
            <button onclick="voteAnswer(${answer.id}, true)">Upvote</button>
            <button onclick="voteAnswer(${answer.id}, false)">Downvote</button>
        `;
        container.appendChild(answerElement);
    }
}

window.voteQuestion = async (questionId, upvote) => {
    const result = await backend.voteQuestion(questionId, upvote);
    if (result) {
        loadQuestions();
    }
};

window.voteAnswer = async (answerId, upvote) => {
    const result = await backend.voteAnswer(answerId, upvote);
    if (result) {
        loadQuestions();
    }
};

window.answerQuestion = async (questionId) => {
    const content = document.getElementById(`answer-${questionId}`).value;
    if (content) {
        const result = await backend.answerQuestion(questionId, content);
        if (result !== null) {
            alert('Answer submitted successfully!');
            loadAnswers(questionId);
        }
    }
};

init();
