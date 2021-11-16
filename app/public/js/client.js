// gửi yêu cầu kết nối đến server
const socket = io();
//gửi data từ client đên server

// handler bad word
const acknowledgment = (err) => {
    if (err) {
        console.log(err);
        //  gửi tin nhắn với nội dung ****
    } else {
        console.log('Gửi tin thành công');
    }
};

document.getElementById('form-messages').addEventListener('submit', (e) => {
    e.preventDefault();
    const messages = document.getElementById('input-messages').value;
    socket.emit('messages-to-server', messages, acknowledgment);
    // tham số 1 'data' : là tên sự kiện
    // tham số 2 là dữ liệu
    // tham số 3 là callback function
});

socket.on('resData', function ({ username, time, content }) {
    document.getElementById('messages-list').innerHTML += `
    <div class="message-item">
        <div class="message__row1">
            <p class="message__name">${username}</p>
            <p class="message__date">${time}</p>
        </div>
        <div class="message__row2">
            <p class="message__content">
              ${content}
            </p>
        </div>
     </div>`;
});
// handle query string - use qs library - location.search
const { room, username } = Qs.parse(location.search, {
    // bỏ dấu chấm hỏi
    ignoreQueryPrefix: true,
});
// send event join room to server
socket.emit('join-room', {
    room,
    username,
});

socket.on('user-list', function (userList) {
    document.querySelector('.app__list-user--content').innerHTML = userList
        .map(
            (user) => `
    <li class="app__item-user">${user.username}</li>
    `
        )
        .reduce((parent, child) => (parent += child), '');
});

document
    .getElementById('btn-share-location')
    .addEventListener('click', function () {
        if (!navigator.geolocation) {
            alert('Trình duyệt không cung cấp location');
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const location = {
                latitude: pos.coords.latitude,
                longtitude: pos.coords.longitude,
            };
            socket.emit('share-location', location);
        });
    });
socket.on('share-location-from-server', ({ username, time, content }) => {
    document.getElementById('messages-list').innerHTML += `
    <div class="message-item">
        <div class="message__row1">
            <p class="message__name">${username}</p>
            <p class="message__date">${time}</p>
        </div>
        <div class="message__row2">
            <a class="message__content" href='${content}' target="_blank" >
              Vị Trí Của ${username}
            </a>
        </div>
     </div>`;
});
