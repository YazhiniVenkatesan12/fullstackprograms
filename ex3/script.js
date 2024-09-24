const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postImage = document.getElementById('post-image');
const postsContainer = document.getElementById('posts-container');
const usersContainer = document.getElementById('users-container');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const feedSection = document.getElementById('feed-section');

let posts = [];
let currentUser = localStorage.getItem('username') || null;
let followers = JSON.parse(localStorage.getItem('followers')) || [];

// Load users from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Load posts from local storage
function loadPosts() {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = storedPosts;
}



// Like post function
function likePost(index) {
    posts[index].likes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

// Dislike post function
function dislikePost(index) {
    posts[index].dislikes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

// Add comment function
function addComment(index) {
    const commentInput = document.getElementById(`comment-input-${index}`);
    const comment = commentInput.value;
    if (comment) {
        posts[index].comments.push(comment);
        localStorage.setItem('posts', JSON.stringify(posts));
        commentInput.value = '';
        displayPosts();
    }
}

// Function to display users to follow
function displayUsers() {
    usersContainer.innerHTML = '';
    users.forEach(user => {
        if (user.username !== currentUser) {
            const userElement = document.createElement('div');
            userElement.innerHTML = `
                <p>${user.username}</p>
                <button onclick="toggleFollow('${user.username}')">
                    ${followers.includes(user.username) ? 'Unfollow' : 'Follow'}
                </button>
            `;
            usersContainer.appendChild(userElement);
        }
    });
}

// Follow/unfollow user
function toggleFollow(username) {
    if (followers.includes(username)) {
        followers = followers.filter(follower => follower !== username);
    } else {
        followers.push(username);
    }
    localStorage.setItem('followers', JSON.stringify(followers));
    displayUsers();
    displayPosts();
}

// Handle registration
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    // Check for existing user
    if (users.find(user => user.username === username)) {
        alert('User already exists');
        return;
    }

    // Register new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please log in.');
    registerForm.style.display = 'none';
    loginForm.style.display = 'block'; // Show the login form
});

// Handle login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('username', username);
        currentUser = username;
        followers = JSON.parse(localStorage.getItem('followers')) || []; // Load followers
        loadPosts(); // Load posts
        displayUsers(); // Display users to follow
        displayPosts(); // Display posts
        feedSection.style.display = 'block'; // Show feed section
        loginForm.style.display = 'none'; // Hide login form
        registerForm.style.display = 'none'; // Hide registration form
    } else {
        alert('Invalid username or password');
    }
});

// Handle post submission
postForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = postContent.value;
    const imageFile = postImage.files[0];
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    const newPost = {
        username: currentUser,
        content: content || null,
        image: imageUrl,
        likes: 0,
        dislikes: 0,
        comments: [],
        date: new Date()
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    postContent.value = '';
    postImage.value = '';
    displayPosts();
});

// Initial load and display
loadPosts();
if (currentUser) {
    feedSection.style.display = 'block'; // Show feed if already logged in
    displayUsers();
    displayPosts();
} else {
    registerForm.style.display = 'block'; // Show registration form if not logged in
}
// Function to calculate time ago
function timeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
}

// Function to display posts
function displayPosts() {
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        if (followers.includes(post.username) || post.username === currentUser) {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p><strong>${post.username}</strong></p>
                <p>${post.content || ''}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                <p><small>${timeAgo(post.date)}</small></p>
                <p>Likes: ${post.likes} | Dislikes: ${post.dislikes}</p>
                <button onclick="likePost(${index})">👍</button>
                <button onclick="dislikePost(${index})">👎</button>
                ${post.username === currentUser ? `<button onclick="deletePost(${index})">🗑️ Delete</button>` : ''}
                <div>
                    <strong>Comments:</strong>
                    <ul>${post.comments.map(comment => `<li>${comment.username} (${timeAgo(comment.date)}): ${comment.text}</li>`).join('')}</ul>
                </div>
            `;
            postsContainer.appendChild(postElement);
        }
    });
}

// Function to delete a post
function deletePost(index) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Function to handle post submission
postForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = postContent.value;
    const imageFile = postImage.files[0];
    let imageUrl = null;
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;
            addNewPost(content, imageUrl);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addNewPost(content, null);
    }
});

function addNewPost(content, imageUrl) {
    const newPost = {
        username: currentUser,
        content: content || null,
        image: imageUrl,
        likes: 0,
        dislikes: 0,
        comments: [],
        date: new Date()
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    postContent.value = '';
    postImage.value = '';
    displayPosts();
}

// Initialize posts and users on page load
loadPosts();
if (currentUser) {
    feedSection.style.display = 'block'; // Show feed if already logged in
    displayUsers();
    displayPosts();
} else {
    registerForm.style.display = 'block'; // Show registration form if not logged in
}
