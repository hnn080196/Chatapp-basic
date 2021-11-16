const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dateFormat = require('date-format');
const Filter = require('bad-words');
const { addUser, getListUserByRoom, removeUser } = require('./model/user');
const app = express();
const httpServer = createServer(app);
const port = 3200;
const publicPath = path.join(__dirname, '../public');

const io = new Server(httpServer, {
    /* options */
});
// emit pha
io.on('connection', (socket) => {
    // handle room chat connection
    socket.on('join-room', ({ room, username }) => {
        // join room
        socket.join(room);
        // nhận dữ liệu chat  từ client
        const newUser = { room, username, id: socket.id };
        addUser(newUser);
        socket.emit('user-list', getListUserByRoom(room));
        socket.emit('resData', {
            username: 'ADMIN',
            time: dateFormat('dd/MM/yyyy-hh:mm:ss', new Date()),
            content: `Chào mừng ${username} vào phòng ${room}`,
        });
        // io gui toi tat ca / socket broadcast gửi cho tất cả trừ your user
        socket.broadcast.to(room).emit('resData', {
            username: 'ADMIN',
            time: dateFormat('dd/MM/yyyy-hh:mm:ss', new Date()),
            content: `${username} Đã vào phòng ${room}`,
        });
        socket.on('messages-to-server', (messages, callback) => {
            /// check bad words
            const filter = new Filter();
            if (filter.isProfane(messages)) {
                return callback('Nội Dung Không Hợp lệ ');
            }
            const resMessage = {
                username: username,
                time: dateFormat('dd/MM/yyyy-hh:mm:ss', new Date()),
                content: messages,
            };
            /// lưu message vào database
            io.to(room).emit('resData', resMessage);
        });
        socket.on('share-location', (location) => {
            const urlLocation = `https://www.google.com/maps?q=${location.latitude},${location.longtitude}`;
            const resLocation = {
                username: username,
                time: dateFormat('dd/MM/yyyy-hh:mm:ss', new Date()),
                content: urlLocation,
            };
            io.to(room).emit('share-location-from-server', resLocation);
        });
    });

    // ngắt kết nối
    socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log(`client ${socket.id} disconnected`);
    });
});
app.use(express.static(publicPath));

httpServer.listen(port, () => {
    console.log('app run on' + port);
});
