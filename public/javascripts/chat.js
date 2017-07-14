var socket =io();

socket.on('server-reg-error',function(data){
    //reg false
    strfalse = "Tên " + data + " đã có người dùng rồi";
    alert(strfalse);
});
//reg ok
socket.on('server-reg-susscess',function(data){
    $("#name-user").html(data);
    $("#login-form").hide(1000);
    $("#chat-form").show(1000);
});
//list user
socket.on('server-send-list-user',function(data){
    $("#box-online").html("");
    data.forEach(function(i) {
        $("#box-online").append("<div class='user'>"+i+"</div>");
    });
});
//received msg
socket.on('server-send-msg',function(data){
    $("#list-msg").append("<div class='msg'>"+data.un+" : "+ data.nd + "</div>");
})
//
socket.on('server-dang-go',function(data){
    $("#thong-bao").html(data);
})
//ngung go
socket.on('server-ngung-nhap',function(){
    $("#thong-bao").html("");
});

$(document).ready(function(){
    $("#login-form").show();
    $("#chat-form").hide();

    $("#reg").click(function(){
        socket.emit('client-reg',$("#username").val());
    });

    $("#logout").click(function(){
        $("#chat-form").hide();
        $("#login-form").show();
        socket.emit('logout');
    });

    $("#dt-msg").focusin(function(){
        socket.emit('dang-nhap-chu');
    });

    $("#dt-msg").focusout(function(){
        socket.emit('ngung-nhap-chu');
    });

    $("#btn-send").click(function(){
        socket.emit('client-send-msg',$("#dt-msg").val());
        $("#dt-msg").val('');
    });
});