const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postImage = document.getElementById('post-image');
const postsContainer = document.getElementById('posts-container');
const usersContainer = document.getElementById('users-container');
const feedSection = document.getElementById('feed-section');

let posts = [];
let currentUser = localStorage.getItem('username') || null;
let followers = [];

// Load users from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Load posts from local storage
function loadPosts() {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = storedPosts;
}

// Display posts
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
                <p><small>${new Date(post.date).toLocaleString()}</small></p>
                <p>Likes: ${post.likes} | Dislikes: ${post.dislikes}</p>
                <button onclick="likePost(${index})">👍</button>
                <button onclick="dislikePost(${index})">👎</button>
                <strong>Comments:</strong>
                <ul>${post.comments.map((comment, i) => `
                    <li>${comment} <button onclick="replyToComment(${index}, ${i})">Reply</button></li>`).join('')}</ul>
                <textarea id="comment-${index}" placeholder="Write a comment..."></textarea>
                <button onclick="addComment(${index})">Add Comment</button>
            `;
            postsContainer.appendChild(postElement);
        }
    });
}

// Display users to follow/unfollow
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

// Follow/unfollow functionality
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

// Add a comment
function addComment(postIndex) {
    const comment = document.getElementById(`comment-${postIndex}`).value;
    if (comment) {
        posts[postIndex].comments.push(comment);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Like a post
function likePost(postIndex) {
    posts[postIndex].likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

// Dislike a post
function dislikePost(postIndex) {
    posts[postIndex].dislikes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

// Reply to a comment
function replyToComment(postIndex, commentIndex) {
    const reply = prompt('Enter your reply:');
    if (reply) {
        posts[postIndex].comments[commentIndex] += ` - Reply: ${reply}`;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Initial setup
if (currentUser) {
    followers = JSON.parse(localStorage.getItem('followers')) || [];
    loadPosts();
    displayUsers();
    displayPosts();
    feedSection.style.display = 'block'; // Show feed section
} else {
    window.location.href = "login.html"; // Redirect to login if not logged in
}
