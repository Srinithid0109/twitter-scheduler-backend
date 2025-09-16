const API_BASE = 'http://localhost:5000/api';

let token = localStorage.getItem('token');

function showAuth() {
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('tweetSection').style.display = 'none';
}

function showRegister() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('tweetSection').style.display = 'none';
}

function showTweets() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('tweetSection').style.display = 'block';
  fetchTweets();
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    token = data.token;
    localStorage.setItem('token', token);
    showTweets();
  } catch (error) {
    alert(error.message);
  }
}

async function register(username, email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) throw new Error('Registration failed');
    alert('Registration successful, please login');
    showAuth();
  } catch (error) {
    alert(error.message);
  }
}

async function fetchTweets() {
  try {
    const response = await fetch(`${API_BASE}/tweets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch tweets');
    const tweets = await response.json();
    const tweetList = document.getElementById('tweetList');
    tweetList.innerHTML = '';
    tweets.forEach(tweet => {
      const li = document.createElement('li');
      li.className = 'tweet-item';
      li.innerHTML = `
        <p>${tweet.content}</p>
        <time>Scheduled for: ${new Date(tweet.scheduledAt).toLocaleString()}</time>
      `;
      tweetList.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
}

async function scheduleTweet(content, scheduledAt) {
  try {
    const response = await fetch(`${API_BASE}/tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content, scheduledAt })
    });
    if (!response.ok) throw new Error('Failed to schedule tweet');
    fetchTweets();
  } catch (error) {
    alert(error.message);
  }
}

// Event listeners
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  login(email, password);
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  register(username, email, password);
});

document.getElementById('tweetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const content = document.getElementById('tweetContent').value;
  const scheduledAt = document.getElementById('scheduleTime').value;
  scheduleTweet(content, scheduledAt);
  document.getElementById('tweetContent').value = '';
  document.getElementById('scheduleTime').value = '';
});

document.getElementById('showRegister').addEventListener('click', (e) => {
  e.preventDefault();
  showRegister();
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  showAuth();
});

// Initial load
if (token) {
  showTweets();
} else {
  showAuth();
}
