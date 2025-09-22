const userList = document.getElementById('user-list');
const peerUsernameInput = document.getElementById('peer-username');

export function update_user_list(users, currentUsername) {
    userList.innerHTML = '';
    users.forEach(user => {
        if (user !== currentUsername) {
            const li = document.createElement('li');
            li.textContent = user;
            li.addEventListener('click', () => {
                peerUsernameInput.value = user;
            });
            userList.appendChild(li);
        }
    });
}
