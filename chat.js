const usernameHeader = document.getElementById('usernameHeader');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const chatBoxList = document.getElementById('chatBoxList');
const userCount = document.getElementById('userCount');
const userNameList = document.getElementById('userNameList'); // Added this line

const socket = io.connect('http://127.0.0.1:4000');
let username = prompt('Enter your name') || 'Guest';

console.log(username);
socket.emit('join', username);

usernameHeader.innerText = username;

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    socket.emit('new_message', message);
    messageInput.value = '';
});

socket.on('load_messages', (messages) => {
    messages.forEach((message) => {
        displayMessage(message.username, message.message);
    });
});

socket.on('broadcast_message', (message) => {
    displayMessage(message.username, message.message);
});

socket.on('update_users', (data) => {
    userCount.innerText = data.userCount;

   
    updateUserList(data.users);
});

function updateUserList(users) {
    // Clear previous user list
    userNameList.innerHTML = '';

    // Add each user to the list
    users.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.innerText = user;
        userDiv.classList = 'userButtonBox';
        userNameList.appendChild(userDiv);
    });
}

function displayMessage(username, message) {
const messageDiv = document.createElement('div');
const messageInner = document.createElement('div');
const topDiv = document.createElement('div');
const spanUserName = document.createElement('span');
const spanTimeStamp = document.createElement('span');
const bottomDiv = document.createElement('div');

// Create and append the circular image
const userAvatar = document.createElement('img');
userAvatar.src = './images/user.jpg'; // Replace with the actual path to your image
userAvatar.alt = 'User Avatar';
userAvatar.classList.add('userAvatar');
// topDiv.appendChild(userAvatar);

spanUserName.innerText = username;
spanUserName.classList = 'spanUserNmae';
spanTimeStamp.innerText = new Date().toLocaleTimeString();

topDiv.classList = 'top';
topDiv.appendChild(spanUserName);
topDiv.appendChild(spanTimeStamp);

bottomDiv.classList = 'bottom';
bottomDiv.innerText = message;

messageInner.appendChild(topDiv);
messageInner.appendChild(bottomDiv);

messageDiv.classList = "messageColumn"
messageDiv.appendChild(userAvatar);
messageDiv.appendChild(messageInner);
chatBoxList.appendChild(messageDiv);

// Determine the class based on the sender
// if (username === 'Guest') {
messageDiv.classList.add('messageContainer', 'receivedMessage');
// } else {
//     messageDiv.classList.add('messageContainer', 'sentMessage');
// }
}