const baseURL = 'http://127.0.0.1:8000/api';
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}

const params = {
    params: {
        'limit': 50
    }
}
setupUI();

function setupUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        // User is logged in
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'flex';
    } else {
        // User is not logged in
        document.getElementById('login-btn').style.display = 'flex';
        document.getElementById('register-btn').style.display = 'flex';
        document.getElementById('logout-btn').style.display = 'none';
    }

}

// get posts
axios.get(`${baseURL}/posts`, config, params)
    .then(response => {
        let posts = response.data.data;
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        for (post of posts) {
            postsContainer.innerHTML +=
                `<div class="card mb-3 shadow" id ="post">
                <h5 class="card-header">
                    <img src="${post.user.image_url}" alt="" class="rounded-circle border border-2" width="40px"
                        height="40px">
                    <b class="">@${post.user.username}</b>
                </h5>
                <div class="card-body">
                    <img class="w-100 rounded" src="${post.image_url}" alt="">
                    <h6 style="color: rgb(193, 193, 193);" class="mt-1">2 min age</h6>
                    <h5>${post.title}</h5>
                    <p id="postBody">${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="./node_modules/bootstrap-icons/icons" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>

                        <span>(${post.comments_count}) Comments</span>
                    </div>
                </div>

            </div>`
        }
    })
    .catch(error => {
        console.error(error);
    });

function loginBtnClicked() {
    const loginModel = document.getElementById('login-model');
    const modal = bootstrap.Modal.getInstance(loginModel);
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    console.log(email, password);
    axios.post(`${baseURL}/login`, {
        email: email,
        password: password
    })
        .then(response => {
            console.log(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            showToast('Logged in successfully', 'success');
            modal.hide();

        })
        .catch(error => {
            console.error(error);
            modal.hide();
            showToast(`${error.response.data.message}`, 'failed');
        });
}

function registerBtnClicked() {
    const registerModel = document.getElementById('register-model');
    const modal = bootstrap.Modal.getInstance(registerModel);
    const username = document.getElementById('username-input').value;
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('register-email-input').value;
    const password = document.getElementById('register-password-input').value;
    console.log(username, name, email, password);
    axios.post(`${baseURL}/register`, {
        username: username,
        name: name,
        email: email,
        password: password
    })
        .then(response => {
            console.log(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            showToast('Registered successfully', 'success');
            modal.hide();

        })
        .catch(error => {
            console.error(error);
            modal.hide();
            showToast(`${error.response.data.message}`, 'failed');
        });
}
function logoutBtnClicked() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setupUI();
    showToast('Logged out successfully', 'success');
}

function showToast(message, type) {
    const toastLive = document.getElementById('liveToast')
    toastLive.querySelector('.toast-body').textContent = message;
    toastLive.style.backgroundColor = type === 'success' ? 'green' : 'red';
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)
    toastBootstrap.show()
}

