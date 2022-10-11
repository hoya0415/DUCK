const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});
const PORT = process.env.PORT || 4000;

// 현재 채팅 룸에 몇명있는지 확인
function countRoom(roomId){
    return io.sockets.adapter.rooms.get(roomId).size;
}

// 커넥션 됐을 때 이벤트
io.on('connection', (socket) => {
    console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");
    socket.emit('socketId', socket.id)

    socket.on('joinRoom', (num) => { 
        let roomId = num;
        socket.join(roomId);
        let cnt = countRoom(roomId)
        io.to(roomId).emit('numOfPeople', cnt)
        console.log('JOIN ROOM LIST', io.sockets.adapter.rooms);
        console.log(`${roomId}방 인원수 : ${countRoom(roomId)}`);
        // io.to(roomId).emit('userCount', io.engine.clientsCount)
    });

    console.log(io.sockets.adapter.rooms)
    socket.on('sendChat', (data) => { 
        console.log(`Msg: ${data.contents}`);
        io.to(data.roomId).emit('broadcast', data); 
    });

    socket.on('leaveRoom', (num) => {
        let roomId = num;
        socket.leave(roomId);
        let cnt = countRoom(roomId)
        io.to(roomId).emit('numOfPeople', cnt)
        console.log('JOIN ROOM LIST', io.sockets.adapter.rooms);
        console.log(`${roomId}방 인원수 : ${countRoom(roomId)}`);
    })
})


server.listen(PORT, function(){
    console.log(`server is running ${PORT}`);
})