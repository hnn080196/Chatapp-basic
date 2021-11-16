let userList = [
    { id: 1, room: 'NodeJs', username: 'Nguyen Ngoc Hoa' },
    { id: 2, room: 'ReactJs', username: 'UserTest01' },
    { id: 3, room: 'ReactJs', username: 'UserTest02' },
];

const addUser = (user) => (userList = [...userList, user]);
const removeUser = (id) => userList.filter((user) => user.id !== id);

const getListUserByRoom = (room) =>
    userList.filter((user) => user.room === room);

const getUserById = (id) => userList.filter((user) => user.id === id);

module.exports = {
    addUser,
    removeUser,
    getListUserByRoom,
    getUserById,
};
