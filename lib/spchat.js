module.exports.chat = function(io) {
    listuser= ["admin"];
    io.on('connection', function(socket){
        console.log('a user connected');
        //disconect
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        //get data
        socket.on('client-reg',function(data){
            if(listuser.indexOf(data)>=0){
            //false
            socket.emit('server-reg-error',data);
            } else {
            listuser.push(data);
            socket.emit('server-reg-susscess',data);
            socket.user = data;
            io.sockets.emit('server-send-list-user',listuser);
            }
        });
        //log out
        socket.on('logout',function(){
            listuser.splice(listuser.indexOf(socket.user),1);
            socket.broadcast.emit('server-send-list-user',listuser);
        });
        //sent msg;
        socket.on('client-send-msg',function(data){
            io.sockets.emit('server-send-msg',{ un:socket.user , nd:data });
        })
        //dang go
        socket.on('dang-nhap-chu',function(){
            s = socket.user + " đang gõ.";
            io.sockets.emit('server-dang-go',s);
        });
        //ngung go
        socket.on('ngung-nhap-chu',function(){
            io.sockets.emit('server-ngung-nhap');
        });
        });
    };